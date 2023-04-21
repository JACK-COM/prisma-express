/**
 * @file Users.Queries.ts
 * @description GraphQL queries relating to `User` data
 */

import { queryField } from "nexus";
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
