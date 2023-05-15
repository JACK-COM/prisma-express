/**
 * @file Explorations.Mutations
 * @description GraphQL mutations for `Explorations` and `Exploration Scenes`.
 */

import { mutationField, intArg, nonNull } from "nexus";
import * as ExplorationsService from "../../services/explorations.service";

/**
 * Create opr update a new `Exploration`
 * @param data  Exploration input data
 * @returns `MFExploration` object from service
 * @throws Error if user is not logged in
 * @throws Error if user is not authorized to create an exploration
 */
export const upsertExploration = mutationField("upsertExploration", {
  type: "MFExploration",
  args: { data: nonNull("MFExplorationUpsertInput") },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExploration` object from service
   * @throws Error if user is not logged in
   */
  resolve: async (_, { data: data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("Authentication required to create an exploration");
    }

    // Create exploration
    const { Scenes = [], ...rest } = data;
    const newExploration = await ExplorationsService.upsertExploration(
      ExplorationsService.pruneExplorationData({
        ...rest,
        id: data.id || undefined,
        public: data.public || false
      })
    );
    if (Scenes && Scenes?.length) {
      const newScenes = await ExplorationsService.upsertExplorationScenes(
        Scenes.map(ExplorationsService.pruneExplorationSceneData)
      );
      newExploration.Scenes = newScenes;
    }

    return newExploration;
  }
});

/**
 * Create or update an `Exploration Scene`
 * @param data  Exploration Scene input data
 * @returns `MFExplorationScene` object from service
 * @throws Error if user is not logged in
 * @throws Error if user is not authorized to create an exploration
 */
export const upsertExplorationScene = mutationField("upsertExplorationScene", {
  type: "MFExplorationScene",
  args: { data: nonNull("MFExplorationSceneUpsertInput") },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExplorationScene` object from service
   * @throws Error if user is not logged in
   */
  resolve: async (_, { data: scene }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("Authentication required to create an exploration");
    }

    // Create exploration
    return ExplorationsService.upsertExplorationScene(
      ExplorationsService.pruneExplorationSceneData(scene)
    );
  }
});

/**
 * Delete an `Exploration`
 * @param id  Exploration ID
 * @returns `MFExploration` object from service
 * @throws Error if user is not logged in
 * @throws Error if user is not authorized to delete an exploration
 */
export const deleteExploration = mutationField("deleteExploration", {
  type: "MFExploration",
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("Authentication required to delete an exploration");
    }

    // Delete exploration
    return ExplorationsService.deleteExploration(id);
  }
});

/**
 * Delete an `Exploration Scene`
 * @param id  Exploration Scene ID
 * @returns `MFExplorationScene` object from service
 * @throws Error if user is not logged in
 * @throws Error if user is not authorized to delete an exploration
 */
export const deleteExplorationScene = mutationField("deleteExplorationScene", {
  type: "MFExplorationScene",
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExplorationScene` object from service
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("Authentication required to delete an exploration");
    }

    // Delete exploration
    return ExplorationsService.deleteExplorationScene(id);
  }
});
