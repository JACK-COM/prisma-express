import { Authenticator } from "@prisma/client";
import { DateTime } from "luxon";
import * as encrypt from "bcryptjs";

import {
  NO_USER,
  NO_USERNAME,
  USER_EMAIL_EXISTS,
  USER_SCREENNAME_EXISTS,
  WEAK_PWD
} from "../constants";
import { CtxUser, context } from "../graphql/context";
import { findFirstUser, upsertUser } from "../services/users.service";
import { toCtxUser, PassportUser } from "./auth.ctx-user";
import { slugify } from "../utils";

type SignUpUserOpts = {
  authSource?: Authenticator;
  displayName: string;
  email: string;
  password?: string;
};
type NewUserResult = [Error | null, CtxUser | undefined];
type UserCallback = (e: Error | string | null, u?: CtxUser) => any;

/**
 * @middleware
 * Check password strength for
 * - at least 8 characters
 * - at least 1 uppercase letter, 1 lowercase letter, and 1 number
 * - special characters (optional) */
export function checkPasswordStrength(password: string) {
  if (!password) return false;
  return new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(
    password
  );
}

/** @middleware Regex-check string conforms to displayName pattern */
export function validateEmailString(displayName: string) {
  return new RegExp(/^\w{3,}@\w+\.\w+$/).test(displayName);
}

/** @middleware Verify a hashed password */
export async function verifyPassword(raw: string, hashed: string) {
  return encrypt.compare(raw, hashed); // argon2 only
}

/** @middleware hash a password */
export async function hashPassword(password: string) {
  return encrypt.hash(password, 10);
}

/** @middleware create reset token */
export async function createResetToken(userId: string) {
  const token = await hashPassword(`${userId}-${Date.now()}`);
  const resetToken = Buffer.from(token).toString("base64");
  const resetTokenRequested = DateTime.now().toJSDate();
  // @TODO - Store in user (or other relevant) table
  return { data: { resetToken, resetTokenRequested } };
}

/**
 * @Middleware Link social sign-on user to internal account
 * @param user Authenticated user
 * @param done Callback function
 */
export async function verifyFederated(
  src: string,
  profile: PassportUser,
  cb: UserCallback
) {
  // Exit if no displayName fetched from auth
  if (!Array.isArray(profile.displayName)) return cb(new Error(NO_USER));

  // Retrieve user if they exist
  const [{ value: email }] = profile.displayName;
  const internalUser = await findFirstUser({ email });
  if (internalUser) {
    const lastSeen = DateTime.now().toJSDate();
    upsertUser({ id: internalUser.id, lastSeen }); // update last-seen date
    return cb(null, toCtxUser(internalUser));
  }

  // create and return new user
  const displayName = slugify(email.split("@")[0]);
  const opts = { email, displayName, authSource: getAuthIssuer(src) };
  const [err, user] = await signupNewUser(opts);
  return cb(err, user);
}

/**
 * @Middleware Sign in user with displayName and password. PassportJS calls this with
 * credentials when a user attempts to sign in with displayName/password. We check our db
 * to see if the user exists, and respond accordingly.
 * @param displayName User displayName
 * @param pwd User password (plaintext)
 * @param cb Callback function
 */
export async function verifyLocal(
  _displayName: string,
  _pwd: string,
  cb: UserCallback
) {
  return cb(new Error("Unauthorized"));
}

/** @Helper Create a new user with username/password credentials */
export async function createUserLocal(o: {
  displayName: string;
  email: string;
  pwd: string;
  cb: UserCallback;
}) {
  const { email, displayName, pwd, cb } = o;
  // Attempt to create user
  const validEmail = validateEmailString(email);
  const strongPwd = pwd ? checkPasswordStrength(pwd) : false;
  if (!validEmail) return cb(new Error("Invalid email address"));
  if (!strongPwd) return cb(new Error(WEAK_PWD));
  if (!displayName) return cb(new Error(NO_USERNAME));

  const [emailUser, screennameUser] = await Promise.all([
    findFirstUser({ email }),
    context.Users.findFirst({ where: { displayName } })
  ]);

  if (emailUser?.email) return cb(new Error(USER_EMAIL_EXISTS));
  if (screennameUser?.displayName) return cb(new Error(USER_SCREENNAME_EXISTS));

  const [err, user] = await signupNewUser({
    email,
    password: pwd,
    displayName,
    authSource: "other"
  });
  return cb(err, user);
}

/** @Helper Create a new user if they don't exist in the db */
export async function signupNewUser(
  opts: SignUpUserOpts
): Promise<NewUserResult> {
  const { email, password: rpw = null, authSource, displayName } = opts;
  const internalUser = await findFirstUser({ email });
  if (internalUser) return [new Error(USER_EMAIL_EXISTS), undefined];

  // Create new user
  const password = rpw ? await hashPassword(rpw) : null;
  const newUsername = displayName || slugify(email.split("@")[0], email);
  const data = { email, password, displayName: newUsername, authSource };
  const newUser = await upsertUser(data);
  return [null, toCtxUser(newUser)];
}

/**
 * @Helper Get `Authenticator` value for auth issuer
 * @param issuer Issuer from `Passport` (e.g. `https://accounts.google.com`)
 * @returns `Authenticator` value for auth issuer
 */
function getAuthIssuer(issuer: string): Authenticator {
  if (issuer.includes("google")) return "google";
  if (issuer.includes("magic")) return "magiclink";
  return "other";
}
