/**
 * @file Users.Queries.ts
 * @description GraphQL queries relating to `User` data
 */

import { intArg, list, nonNull, queryField } from "nexus";
import * as UsersService from "../../services/users.service";
import { ImageCategory, listUserAWSFiles } from "../../services/aws.service";

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

/** List user's AWS files in a category */
export const listUserFiles = queryField("listUserFiles", {
  type: nonNull(list("String")),
  description: "List a user's AWS files in a category",
  args: { category: nonNull("String") },
  resolve: async (_, { category }, { user }) => {
    if (!user) return [];
    const { files } = await listUserAWSFiles(
      user.id,
      category as ImageCategory
    );
    return files;
  }
});
