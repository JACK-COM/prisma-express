/**
 * @file Users.Queries.ts
 * @description GraphQL queries relating to `User` data
 */

import { intArg, nonNull, queryField } from "nexus";
import * as UsersService from "../../services/users.service";

/** Get authenticated user */
export const getAuthUser = queryField("getAuthUser", {
  type: "CsUser",
  description: "Get the currently authenticated user",
  resolve: async (_, _args, { user }) => {
    if (!user) return null;
    const [userData] = await Promise.all([UsersService.getUserById(user.id)]);
    if (!userData) return null;
    return userData;
  }
});

/** get an author by id */
export const getUser = queryField("getUser", {
  type: "CsUser",
  description: "Get a user by id",
  args: { id: nonNull(intArg()) },
  resolve: async (_, { id }) => {
    return await UsersService.getUserById(id);
  }
});
