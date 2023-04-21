/**
 * @file Users.Service
 * @description Database helper service for `User` model
 */
import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

export type UpsertUserInput =
  | Prisma.UserUpsertArgs["create"] & Prisma.UserUpsertArgs["update"];
type SearchUserInput = Partial<
  Pick<User, "displayName" | "firstName" | "lastName" | "email">
>;
const { Users } = context;

/** create `User` record */
export async function upsertUser(user: UpsertUserInput) {
  const today = DateTime.now().toISO();
  const data: UpsertUserInput = {
    ...user,
    role: user.role || "Reader",
    created: user.created || today,
    lastSeen: today
  };

  return data.id
    ? Users.update({ data, where: { id: data.id } })
    : Users.create({ data });
}

/** find ALL `User` records matching params */
export async function findAllUser(filters: SearchUserInput) {
  const where = constructeWhereInput(filters);
  return Users.findMany({ where });
}

/** find FIRST `User` records matching params */
export async function findFirstUser(where: SearchUserInput & { id?: number }) {
  return Users.findUnique({ where });
}

/** find ONE `User` record matching params (returns more stuff) */
export async function getExpandedUser(where: SearchUserInput) {
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

/** find one `User` record matching params */
export async function getUser(id: User["id"]) {
  return findFirstUser({ id });
}

/** delete `User` record matching params */
export async function deleteUser(id: number) {
  return Users.delete({ where: { id } });
}

// ROLES AND AUTHORIZATION

/** Require user `id` to match or exceed role `role` */
export async function requireRole(
  id: User["id"],
  requiredRole: User["role"] = "Author"
) {
  const where: Prisma.UserWhereUniqueInput = { id };
  const include: Prisma.UserSelect = { role: true };
  const args = { where, include };
  const fallback: { role: User["role"] } = { role: "Reader" };
  const { role } = (await Users.findFirst(args)) || fallback;
  return isAuthorized(role, requiredRole);
}

const roleRanks: User["role"][] = ["Reader", "Author"];

/** Check whether `userRole` matches or exceeds `ref` */
export function isAuthorized(role: User["role"], ref: User["role"] = "Author") {
  return roleRanks.indexOf(role || "Reader") >= roleRanks.indexOf(ref);
}

// HELPERS

function constructeWhereInput(filters: SearchUserInput) {
  const where: Prisma.UserWhereInput & Prisma.UserWhereUniqueInput = {};
  if (filters.email) where.email = filters.email;

  where.OR = [];
  if (filters.displayName) where.OR.push({ displayName: filters.displayName });
  if (filters.firstName) where.OR.push({ firstName: filters.firstName });
  if (filters.lastName) where.OR.push({ lastName: filters.lastName });
  return where;
}
