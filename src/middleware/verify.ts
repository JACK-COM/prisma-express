/**
 * @Module Verify
 * @Description
 * Verify user credentials and create new users
 */
import jwt from "jsonwebtoken";
import { ENCRYPT_SECRET, NO_USER, USER_EMAIL_EXISTS } from "../constants";
import { argon2Verify, encrypt } from "./encrypt";
import { Authenticator, User,  } from "@prisma/client";
import { CtxUser } from "../graphql/context";
import {
  USER_CAP,
  countUsers,
  findFirstUser,
  upsertUser
} from "../services/users.service";

type PassportUser = {
  // The provider with which the user authenticated (facebook, twitter, etc.).
  provider: string & ("google" | "facebook" | "twitter");
  // A unique identifier for the user, as generated by the service provider.
  id: string;
  // The name of this user, suitable for display.
  displayName: string;
  // User's given name
  name: {
    // The family name of this user, or "last name" in most Western languages.
    familyName: string;
    // The given name of this user, or "first name" in most Western languages.
    givenName: string;
    // The middle name of this user.
    middleName: string;
  };
  // actual email address, type address (home, work, etc.).
  emails?: { value: string; type?: string }[];
  // The URL of the image.
  photos: string[];
};
type UserCallback = (e: Error | string | null, u?: CtxUser) => any;
type CreateOpts = {
  authSource: Authenticator;
  email: string;
  password?: string;
};
type NewUserResult = [Error | null, CtxUser | undefined];

/** @Middleware Verify JWT token (optional) */
export function verifyJWT(req: any, res: any, next: any) {
  const token = req.cookies.access_token;
  if (!token) return res.status(403).send();

  let payload: void;
  try {
    const jwtSec = process.env.JWT_SEC as string;
    payload = jwt.verify(token, jwtSec, function (err?: any, decoded?: any) {
      if (err) {
        const message = "Failed to authenticate token.";
        return res.json({ success: false, message });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (e: any) {
    console.log(e);
    const message = e.message || "An error occurred while verifying the token.";
    res.status(500).send({ message, payload });
  }
}

/**
 * @Middleware
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

/** @Middleware Regex-check string conforms to email pattern */
export function validateEmailString(email: string) {
  return new RegExp(/^\w{3,}@\w+\.\w+$/).test(email);
}

/** @Middleware Verify an argon2 hashed password */
export async function verifyPassword(raw: string, hashed: string) {
  const sx = ENCRYPT_SECRET;
  return argon2Verify(hashed, raw, { salt: Buffer.from(sx) }); // argon2 only
}

/** 
 * @Helper Generate a `CtxUser` reference for a user's session. Add 
 * any needed values here. 
 */
const toCtxUser = (u: User): CtxUser => ({
  id: u.id,
  email: u.email,
  displayName: u.displayName,
});


/**
 * @Middleware Link social sign-on user to internal account. Returns 
 * error if user not found, or if user cannot be signed up due to
 * user capacity limit (or other error).
 * @param user Authenticated user
 * @param done Callback function
 */
export async function verifyFederated(
  src: string,
  profile: PassportUser,
  cb: UserCallback
) {
  // Exit if no emails fetched from auth
  if (!Array.isArray(profile.emails)) return cb(new Error(NO_USER));

  // Retrieve user if they exist
  const [{ value: email }] = profile.emails;
  const opts = { email, authSource: getAuthIssuer(src) };
  const internalUser = await findFirstUser({ email });
  if (internalUser) return cb(null, toCtxUser(internalUser));

  // create and return new user
  const [err, user] = await getOrCreateUser(opts);
  return cb(err, user);
}

/**
 * @Middleware Sign in user with email and password. Will throw an error
 * if the user has not set a password.
 * @param email User email
 * @param pwd User password (plaintext)
 * @param cb Callback function
 */
export async function verifyLocal(
  email: string,
  pwd: string,
  cb: UserCallback
) {
  const internalUser = await findFirstUser({ email });
  if (!internalUser) return cb(new Error(NO_USER));

  // Check password match if the user has set one
  if (!internalUser.password)
    return cb(new Error("User has not set a password"));
  const match = await verifyPassword(pwd, internalUser.password);
  if (match) return cb(null, toCtxUser(internalUser));

  // password does not match
  return cb(new Error("Invalid username or password"));
}

/** @Helper Create a new user with username/password credentials */
export async function createUserLocal(
  email: string,
  pwd: string,
  cb: UserCallback
) {
  // Attempt to create user
  const validEmail = validateEmailString(email);
  if (!validEmail) return cb(new Error("Invalid email address"));

  const strongPwd = checkPasswordStrength(pwd);
  if (!strongPwd) return cb(new Error("New Password is not strong enough"));

  const password = await encrypt(pwd);
  const opts: CreateOpts = { email, password, authSource: "other" };
  const [err, user] = await getOrCreateUser(opts);
  return cb(err, user);
}

/** @Helper Create a new user if they don't exist in the db */
export async function getOrCreateUser(
  opts: CreateOpts
): Promise<NewUserResult> {
  // Temp: ensure server capacity is not exceeded
  const [userCapacityMax] = await verifyUserCapacity();
  if (userCapacityMax) return [userCapacityMax, undefined];

  const { email, password: rpw = null, authSource } = opts;
  const internalUser = await findFirstUser({ email });
  if (internalUser) return [new Error(USER_EMAIL_EXISTS), undefined];

  // Create new user
  const password = rpw ? await encrypt(rpw) : null;
  const displayName = email;
  const data = { email, password, displayName, authSource };
  const newUser = await upsertUser(data);
  return [null, toCtxUser(newUser)];
}

/** @Middleware MFT-52 | Temp | check whether the server is below a user-count threshold */
export async function verifyUserCapacity() {
  // MFT-52 | Temporary user cap for pre-alpha through beta phase
  const userCount = await countUsers();
  if (userCount >= USER_CAP) {
    return [new Error(`User cap reached`), undefined];
  }
  return [null, undefined];
  // MFT-52 | Temporary cap END
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