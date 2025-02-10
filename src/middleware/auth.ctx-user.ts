import { Prisma, User } from "@prisma/client";
import { UNAUTHENTICATED } from "../constants";
import { CtxUser } from "../graphql/context";
import { getUser } from "../services/users.service";

/** Standardized `User` object for PassportJS compatibility */
export type PassportUser = {
  // The provider with which the user authenticated (facebook, twitter, etc.).
  provider?: string & ("google" | "facebook" | "twitter");
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
  // actual primary_handle address, type address (home, work, etc.).
  primary_handles?: { value: string; type?: string }[];
  // The URL of the image.
  photos: string[];
};

/**
 * Generate a `CtxUser` that will be attached to Express requests. Should include anything
 * that either is needed globally, or can be used to limit requests from the UI
 * @returns `{ error, data }` with user data or any errors encountered
 */
export function toCtxUser(u: User): CtxUser {
  // Encrypt User ID (ensures everyone gets logged out when secret changes)
  const { id, email, image, displayName, lastSeen } = u;
  return { id, displayName, image, email, lastSeen };
}

/**
 * Fetch request-user's data from DB, if available: return error if user not found.
 * @param u Context User (from request) if available
 * @param select If user is found, return these fields from the record
 * @returns `{ error, data }` with user data or any errors encountered
 */
export async function fromCtxUser<F extends Prisma.UserSelect>(
  u?: Pick<CtxUser, "id" | "displayName">,
  select?: F
) {
  if (!u?.id && !u?.displayName) return { error: UNAUTHENTICATED };
  const dbUser = await getUser(u, select);
  return { data: dbUser };
}
