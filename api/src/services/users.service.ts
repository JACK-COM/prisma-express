/**
 * @file Users.Service
 * @description Database helper service for `User` model
 */
import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

type UpsertUserInput =
  | Prisma.UserUpsertArgs["create"] & Prisma.UserUpsertArgs["update"];
type SearchUserInput = Pick<User, "email">;
type UserByIdInput = Pick<User, "id">;
const { Users } = context;

/** create `User` record */
export async function upsertUser(user: UpsertUserInput) {
  const today = DateTime.now().toISO();
  const data: UpsertUserInput = {
    ...user,
    role: user.role || "Author",
    created: today,
    lastSeen: today
  };

  return data.id
    ? Users.update({ data, where: { id: data.id } })
    : Users.create({ data });
}

/** find all `User` records matching params */
export async function findAllUser(where: SearchUserInput) {
  return Users.findMany({ where });
}

/** find one `User` record matching params */
export async function getUser(where: UserByIdInput | SearchUserInput) {
  return Users.findUnique({
    where,
    include: {
      Series: true,
      Books: true,
      Characters: true,
      Timelines: true,
      Worlds: true
    }
  });
}

/** update one `User` record matching params */
export async function updateUser(where: UserByIdInput | SearchUserInput) {
  const user = await Users.findUnique({ where });
  if (!user) return null;

  const lastSeen = DateTime.now().toISO();
  return Users.update({ data: { ...user, lastSeen }, where });
}

/** Require user `id` to match or exceed role `role` */
export async function requireRole(
  id: UserByIdInput["id"],
  requiredRole: User["role"] = "Author"
) {
  const { role: userRole } = (await getUser({ id })) || { role: "Reader" };
  return isAuthorized(userRole, requiredRole);
}

const roleRanks: User["role"][] = ["Reader", "Author"];

/** Check whether `userRole` matches or exceeds `ref` */
export function isAuthorized(role: User["role"], ref: User["role"] = "Author") {
  return roleRanks.indexOf(role || "Reader") >= roleRanks.indexOf(ref);
}

/** delete `User` record matching params */
export async function deleteUser(where: UserByIdInput) {
  const exists = await getUser(where);
  if (!exists) return null;
  await Users.delete({ where });
  return exists;
}
