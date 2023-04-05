import { join } from 'path'
import { makeSchema } from "nexus";
// Types
import * as Objects from "./objects/index";
import * as Queries from "./queries/index";
import * as Mutations from "./mutations/index";
import * as Inputs from "./inputs/index";

const types = { ...Objects, ...Queries, ...Mutations, ...Inputs };

export const schema = makeSchema({
  // Data classes (used to generate SDL types)
  types,

  // Directory where nexus-generated files go
  outputs: {
    typegen: join(__dirname, 'nexus-gen', 'nexus-typegen.ts'),
    schema: join(__dirname, 'nexus-gen', 'schema.graphql'),
  },

  // Context file source
  contextType: {
    export: 'DBContext',
    module: join(__dirname, 'context.ts'),
  },
})