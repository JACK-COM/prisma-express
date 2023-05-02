import fetchRaw, { withTimeout } from "./fetch-raw";

type GQLError = { message: string };
/** Generic typed object */
type ChildProperty<T> = { [k: string]: T } & { errors?: string };

/** Generic graphql Fetch options */
type FetchGQLOpts<T> = {
  /** grapqhl server endpoint */
  url?: string;
  /** grapqhl query string */
  query: string;
  /** grapqhl request variables (if any) */
  variables?: any;
  /** Function to call with the grapqhl response */
  onResolve(x: ChildProperty<T>, errors?: string): T | string;
  /** Optional fallback value if response fails */
  fallbackResponse?: T;
};

/** Abstraction for making server graphql queries */
export async function fetchGQL<T>(opts: FetchGQLOpts<T>) {
  const {
    url = "http://localhost:4001/graphql",
    query,
    variables,
    onResolve,
    fallbackResponse: fallback = {} as T
  } = opts;
  const body = variables
    ? JSON.stringify({ query, variables })
    : JSON.stringify({ query });
  const controller = new AbortController();
  const request = () =>
    fetchRaw<{ data: ChildProperty<T> }>({
      url,
      additionalOpts: { body },
      onResolve: (x, errors) => onResolve(x.data || fallback, errors)
    });

  return withTimeout({ request, fallbackResponse: fallback, controller });
}
export default fetchGQL;
