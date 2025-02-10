import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";
import logger from "../logger";
import { UNAUTHENTICATED, USER_LOGGED_OUT } from "../constants";
import { CtxUser } from "../graphql/context";
import { fromCtxUser } from "./auth.ctx-user";

/**
 * @Middleware Match the authenticated user to db data, or log requester out
 */
export async function matchDBUserGuardian(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const exit =
    !req.path.includes("/graphql") || req.body.operationName !== "GetAuthUser";
  if (exit) return next();

  // User is authenticating, or already authenticated and loading the UI for the first time
  const user = req.user as CtxUser;
  if (!req.isAuthenticated() || !(req.user as CtxUser)) return next();
  // We need to ensure that the authenticated user matches the db user: if not, log them out
  const { error, data } = await fromCtxUser(user);
  if (error || !data) {
    logger.warn(`User ${user.id} does not match ${user.email}: logging out`);
    return handleLogout(req, res, next);
  }
  // Log the user out if last-seen is greater than 14 days
  const lastSeen = DateTime.fromJSDate(new Date(data.lastSeen));
  const inactive = DateTime.now().diff(lastSeen, "days").days > 14;
  if (!inactive) return next();

  logger.warn(`User (${user.id}, ${user.email}) inactive; logging out`);
  return handleLogout(req, res, next);
}

/**
 * shared logout handler
 */
export function handleLogout(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) return next(err);
    const loggedOut = { data: { message: USER_LOGGED_OUT } };
    req.logout(() => res.status(200).json(loggedOut));
  });
}

/** Authentication guard: require authenticated request or fail */
export function authenticatedUserGuardian(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const err = { error: UNAUTHENTICATED };
  if (!req.user || !req.isAuthenticated())
    return void res.status(401).json(err);
  return next();
}
