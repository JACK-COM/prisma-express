import { Express, NextFunction, Request, Response } from "express";
import logger from "../logger";
import { getUserById } from "../services/users.service";
import { CtxUser } from "../graphql/context";
import { DateTime } from "luxon";
import { UNAUTHENTICATED } from "../constants";
import rateLimit from "express-rate-limit";

/** @Middleware ensure that the authenticated user matches the db user, and update their last-seen date */
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
  const userMatch = await matchDBUserToAuth(req.user as CtxUser);
  if (!userMatch) {
    logger.warn(`User (${user.id}, ${user.email}) email mismatch; logging out`);
    return handleLogout(req, res, next);
  }
  // Log the user out if they've been inactive for 14 days
  const lastSeen = DateTime.fromJSDate(new Date(userMatch.lastSeen));
  const now = DateTime.now();
  const inactive = now.diff(lastSeen, "days").days > 14;
  if (inactive) {
    logger.warn(`User (${user.id}, ${user.email}) inactive; logging out`);
    return handleLogout(req, res, next);
  }

  return next();
}

/** @Middleware ensure that the authenticated user matches the db user */
async function matchDBUserToAuth(user: CtxUser) {
  const dbUser = await getUserById(user.id);
  if (!dbUser || dbUser.email !== user.email) return null;
  return dbUser;
}

/** shared logout handler */
export function handleLogout(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) return next(err);
    req.logout(() => res.status(200).send());
  });
}

/** Rate-limiter for routes */
export function configureRateLimiter(app: Express) {
  const limiter = rateLimit({
    windowMs: 1000,
    limit: 12,
    standardHeaders: "draft-7",
    legacyHeaders: false
  });
  app.use(limiter);
}

/** Simple authentication guard */
export function authenticatedUserGuardian(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.isAuthenticated())
    return res.status(401).send(UNAUTHENTICATED);
  return next();
}
