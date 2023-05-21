import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { withTimeout } from "./fetch-raw";
import { GRAPHQL_URL } from "utils";

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache({ addTypename: false }),
  credentials: "include",
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-first" }
  }
});

type GQLError = { message: string };
/** Generic typed object */
type ChildProperty<T> = { [k: string]: T } & { errors?: string };

/** Generic graphql Fetch options */
export type FetchGQLOpts<T> = {
  /** grapqhl server endpoint */
  url?: string;
  /** grapqhl query string */
  query: string;
  /** grapqhl request variables (if any) */
  variables?: any;
  /** grapqhl request variables (if any) */
  refetchQueries?: { query: any; variables?: any }[];
  /** Function to call with the grapqhl response */
  onResolve(x: ChildProperty<T>, errors?: string): T | string;
  /** Optional fallback value if response fails */
  fallbackResponse?: T;
};

/** Abstraction for making server graphql queries */
export async function fetchGQL<T>(opts: FetchGQLOpts<T>) {
  type GQLResponse = ChildProperty<T>;
  const {
    query,
    variables,
    refetchQueries,
    onResolve,
    fallbackResponse: fallback = {} as T
  } = opts;
  const controller = new AbortController();

  return withTimeout({
    controller,
    fallbackResponse: fallback,
    request: async () => {
      // QUERIES
      if (query.startsWith("query")) {
        return apolloClient
          .query<GQLResponse>({ query: gql(query), variables })
          .then((res) => onResolve(res.data || fallback, res.errors as any));
      }

      // MUTATIONS
      return apolloClient
        .mutate({
          mutation: gql(query),
          variables,
          refetchQueries: refetchQueries?.map((x) => ({
            query: typeof x.query === "string" ? gql(x.query) : x.query,
            variables: x.variables
          })),
          onQueryUpdated: (x) => x.refetch()
        })
        .then((res) => onResolve(res.data || fallback));
    }
  });
}

export default fetchGQL;
