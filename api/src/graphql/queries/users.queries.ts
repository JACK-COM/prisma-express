/**
 * @file Users.Queries.ts
 * @description GraphQL queries relating to `User` data
 */

import { intArg, nonNull, queryField } from "nexus";
import * as UsersService from "../../services/users.service";

/** Get authenticated user */
export const getAuthUser = queryField("getAuthUser", {
  type: "MFAuthor",
  description: "Get the currently authenticated user",
  resolve: async (_, _args, { user }) => {
    if (!user) return null;
    return await UsersService.getUser(user.id);
  }
});

/** get an author by id */
export const getAuthor = queryField("getAuthor", {
  type: "MFAuthor",
  description: "Get an author by id",
  args: { id: nonNull(intArg()) },
  resolve: async (_, { id }) => {
    return await UsersService.getUser(id);
  }
});
