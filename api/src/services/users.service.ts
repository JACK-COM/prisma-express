import { Prisma, User } from "@prisma/client";
import { DateTime } from "luxon";
import { context } from "../graphql/context";

type CreateUserInput = Prisma.UserCreateInput;
type SearchUserInput = Pick<CreateUserInput, "email">;
type UserByIdInput = Pick<User, "id">;
const { Users: UserDB } = context;

/** create user record */
export async function upsertUser(newUser: CreateUserInput) {
  const today = DateTime.now().toISO();
  const data: CreateUserInput = {
    ...newUser,
    role: newUser.role || "researcher",
    created: today,
    lastSeen: today
  };

  return UserDB.upsert({
    create: data,
    update: data,
    where: { email: newUser.email }
  });
}

/** find all user records matching params */
export async function findAllUser(where: SearchUserInput) {
  return UserDB.findMany({ where });
}

/** find one user record matching params */
export async function getUser(where: UserByIdInput | SearchUserInput) {
  return UserDB.findUnique({ where });
}

/** update one user record matching params */
export async function updateUser(where: UserByIdInput | SearchUserInput) {
  const user = await UserDB.findUnique({ where });
  if (!user) return null;

  const lastSeen = DateTime.now().toISO();
  return UserDB.update({ data: { ...user, lastSeen }, where });
}

/** Require user `id` to match or exceed role `role` */
export async function requireRole(id: UserByIdInput["id"], role: User["role"]) {
  const { role: userRole } = (await getUser({ id })) || { role: "researcher" };
  return isAuthorized(userRole, role);
}

const roleRanks: User["role"][] = [
  "researcher",
  "dataentry",
  "moderator",
  "admin"
];

/** Check whether `userRole` matches or exceeds `ref` */
export function isAuthorized(
  userRole?: User["role"],
  ref: User["role"] = "moderator"
) {
  return roleRanks.indexOf(userRole || "researcher") >= roleRanks.indexOf(ref);
}

/** delete user record matching params */
export async function deleteUser(where: UserByIdInput) {
  const exists = await getUser(where);
  if (!exists) return null;
  await UserDB.delete({ where });
  return exists;
}
