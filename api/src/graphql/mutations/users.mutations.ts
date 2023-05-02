/**
 * @file Users.Mutations.ts
 * @description GraphQL mutations relating to `User` data
 */

import { intArg, mutationField, nonNull } from "nexus";
import * as UsersService from "../../services/users.service";

/** Update user info. Requires existing user */
export const updateUser = mutationField("updateUser", {
  type: "MFAuthor",
  description: "Update user info",
  args: {
    id: nonNull(intArg()),
    data: nonNull("MFUserUpsertInput")
  },

  resolve: async (_, { id, data }, { user, Users }) => {
    if (!user) throw new Error("Not authenticated");
    else if (!id) throw new Error("User ID is required");

    const isAuthorized = user && user.id === id;
    if (!isAuthorized) throw new Error("Not authorized");

    const dbUser = await Users.findFirst({ where: { id } });
    if (!dbUser) throw new Error("User not found");

    // Check for email conflicts if email is changing
    if (data.email && data.email !== dbUser.email) {
      const emailExists = await Users.findFirst({
        where: { email: data.email }
      });
      if (emailExists) throw new Error("Email already exists");
    }

    return UsersService.upsertUser({
      id,
      role: dbUser.role,
      authSource: dbUser.authSource,
      email: data.email || dbUser.email,
      displayName: data.displayName || dbUser.displayName,
      firstName: data.firstName || dbUser.firstName,
      lastName: data.lastName || dbUser.lastName,
      image: data.image || dbUser.image
    });
  }
});
