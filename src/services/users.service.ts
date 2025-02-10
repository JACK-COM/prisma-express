/**
 * @file Users.Service
 * @description Database helper service for `User` model
 */
import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

export type UpsertUserInput =
  | Prisma.UserUpsertArgs["create"]
  | Prisma.UserUpsertArgs["update"];
type UserSearchInput = Partial<Pick<User, "displayName" | "email" | "id">>;
type UserQueryOpts = Prisma.UserWhereInput & Prisma.UserWhereUniqueInput;

const { Users } = context;
const now = () => DateTime.now().toJSDate();

/** shared fields when selecting a user */
const userSelect: Prisma.UserSelect = {
  id: true,
  displayName: true,
  lastSeen: true
};

/** count `User` records */
export async function countUsers() {
  return Users.count();
}

/** create `User` record */
export async function upsertUser(user: UpsertUserInput) {
  const data: UpsertUserInput = { ...user };
  if (user.id) return Users.update({ data, where: { id: user.id as number } });

  data.createdAt = now();
  return Users.create({ data: data as Prisma.UserUpsertArgs["create"] });
}

/** @internal find ALL `User` records matching params */
export async function findAllUser(filters: UserSearchInput) {
  const where = buildQuery(filters);
  return Users.findMany({ where });
}

/** find FIRST `User` records matching params */
export async function findFirstUser(filters: UserSearchInput) {
  return Users.findUnique({ where: buildQuery(filters) });
}

/** find ONE `User` record matching params (returns more stuff) */
export async function getExpandedUser(filters: UserSearchInput) {
  return Users.findUnique({ where: buildQuery(filters) });
}

/** default fields for selecting a user */
/** find one `User` record matching params */
export async function getUser<T extends Prisma.UserSelect>(
  queryOpts: UserSearchInput,
  fields = userSelect as T,
  mergeFields = false
) {
  const select = (mergeFields ? { ...userSelect, ...fields } : fields) as T;
  return Users.findUnique({ select, where: buildQuery(queryOpts) });
}

/** delete `User` record matching params */
export async function deleteUser(id: number) {
  return Users.delete({ where: { id } });
}

// HELPERS

function buildQuery(filters: UserSearchInput) {
  const where = {} as UserQueryOpts;
  if (filters.displayName) where.displayName = filters.displayName;
  if (filters.id) where.id = filters.id;
  return where;
}
