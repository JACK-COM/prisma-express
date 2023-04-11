/**
 * @file Users.Service
 * @description Database helper service for `User` model
 */
import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

type UpsertUserInput =
  | Prisma.UserUpsertArgs["create"] & Prisma.UserUpsertArgs["update"];
type SearchUserInput = Pick<CreateUserInput, "email">;
type UserByIdInput = Pick<User, "id">;
const { Users } = context;

/** create user record */
export async function upsertUser(newUser: CreateUserInput) {
  const today = DateTime.now().toISO();
  const data: CreateUserInput = {
    ...newUser,
    role: newUser.role || "Author",
    created: today,
    lastSeen: today
  };

  return Users.upsert({
    create: data,
    update: data,
    where: { email: newUser.email }
  });
}

/** find all user records matching params */
export async function findAllUser(where: SearchUserInput) {
  return Users.findMany({ where });
}

/** find one user record matching params */
export async function getUser(where: UserByIdInput | SearchUserInput) {
  return Users.findUnique({ where });
}

/** update one user record matching params */
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
export function isAuthorized(
  userRole: User["role"],
  ref: User["role"] = "Author"
) {
  return roleRanks.indexOf(userRole || "Reader") >= roleRanks.indexOf(ref);
}

/** delete user record matching params */
export async function deleteUser(where: UserByIdInput) {
  const exists = await getUser(where);
  if (!exists) return null;
  await Users.delete({ where });
  return exists;
}
