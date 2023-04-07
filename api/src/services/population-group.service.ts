/**
 * @file PopulationGroup.Service
 * @description Database helper service for `PopulationGroup` model
 */

import { Prisma, PopulationGroup } from "@prisma/client";
import { context } from "../graphql/context";

type CreatePopulationGroupInput =
    | Prisma.PopulationGroupUpsertArgs["create"] & Prisma.PopulationGroupUpsertArgs["update"];
type SearchPopulationGroupInput = Pick<CreatePopulationGroupInput, "name" | "authorId">;
type PopulationGroupByIdInput = Pick<PopulationGroup, "id">;
const { PopulationGroups } = context;

/** create populationGroup record */
export async function upsertPopulationGroup(newPopulationGroup: CreatePopulationGroupInput) {
    const data: CreatePopulationGroupInput = { ...newPopulationGroup };

    return PopulationGroups.upsert({
        create: data,
        update: data,
        where: { id: newPopulationGroup.id }
    });
}

/** find all populationGroup records matching params */
export async function findAllPopulationGroup(where: PopulationGroupByIdInput | SearchPopulationGroupInput) {
    return PopulationGroups.findMany({ where });
}

/** find one populationGroup record matching params */
export async function getPopulationGroup(where: PopulationGroupByIdInput) {
    return PopulationGroups.findUnique({ where });
}

/** update one populationGroup record matching params */
export async function updatePopulationGroup(
    where: PopulationGroupByIdInput,
    data: CreatePopulationGroupInput
) {
    return PopulationGroups.update({ data, where });
}

/** delete a populationGroup */
export async function deletePopulationGroup(where: PopulationGroupByIdInput) {
    return PopulationGroups.delete({ where });
}