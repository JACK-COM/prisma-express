/**
 * @file Users.Service
 * @description Database helper service for `User` model
 */
import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

export type UpsertUserInput = Prisma.UserUpsertArgs["create"] &
  Prisma.UserUpsertArgs["update"];
type SearchUserInput = Partial<
  Pick<User, "displayName" | "firstName" | "lastName" | "email">
>;
const { Users } = context;

/** count `User` records */
export async function countUsers() {
  return Users.count();
}

/** create `User` record */
export async function upsertUser(user: UpsertUserInput) {
  const now = DateTime.now().toJSDate();
  const data: UpsertUserInput = { ...user };
  data.updatedAt = now;

  if (!data.id) {
    data.createdAt = now;
    return Users.create({ data });
  }

  return Users.update({ data, where: { id: data.id } });
}

/** find ALL `User` records matching params */
export async function findAllUser(filters: SearchUserInput) {
  const where = constructWhereInput(filters);
  return Users.findMany({ where });
}

/** find FIRST `User` records matching params */
export async function findFirstUser(
  filters: SearchUserInput & { id?: number }
) {
  return Users.findUnique({ where: constructWhereInput(filters) });
}

/** find ONE `User` record matching params (returns more stuff) */
export async function getExpandedUser(filters: SearchUserInput) {
  return Users.findUnique({
    where: constructWhereInput(filters)
  });
}

/** find one `User` record matching params */
export async function getUserById(id: User["id"]) {
  return Users.findUnique({ where: { id } });
}

/** delete `User` record matching params */
export async function deleteUser(id: number) {
  return Users.delete({ where: { id } });
}

// HELPERS

function constructWhereInput(filters: SearchUserInput) {
  const where: any = {};
  if (filters.email) where.email = filters.email;

  where.OR = [];
  if (filters.displayName) where.OR.push({ displayName: filters.displayName });
  if (filters.firstName) where.OR.push({ firstName: filters.firstName });
  if (filters.lastName) where.OR.push({ lastName: filters.lastName });
  if (where.OR.length === 0) delete where.OR;
  return where as Prisma.UserWhereInput & Prisma.UserWhereUniqueInput;
}
