type GQLError = { message: string };
/** Generic typed object */
type ChildProperty<T> = { [k: string]: T } & { errors?: string };

/** Generic graphql response handler */
type GQLResponseHandler<T> = {
  (x: ChildProperty<T>, errors?: string): T | string;
};

/** Generic graphql Fetch options */
type FetchGQLOpts<T> = {
  /** grapqhl server endpoint */
  url?: string;
  /** grapqhl query string */
  query: string;
  /** grapqhl request variables (if any) */
  variables?: any;
  /** Function to call with the grapqhl response */
  onResolve: GQLResponseHandler<T>;
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
    fetch(url, {
      method: "post",
      body,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal
    })
      .then((res) => res.json())
      .then((res) =>
        onResolve(res.data || fallback, condenseErrors(res.errors))
      )
      .catch((e) =>
        onResolve(
          {} as ChildProperty<T>,
          e ? condenseErrors(e.errors || e) : "FetchGQL Network Error"
        )
      );

  return withTimeout({ request, fallbackResponse: fallback, controller });
}
export default fetchGQL;

/** Props for making a cancellable http request */
type CancelableProps<T> = {
  request: Promise<any> | (() => Promise<any>);
  fallbackResponse?: T;
  timeout?: number;
  controller: AbortController;
};

/** Halt a request if it takes longer than `timeout` to resolve */
export async function withTimeout<T>(opts: CancelableProps<T>): Promise<T> {
  const { request, fallbackResponse, controller, timeout = 3500 } = opts;
  return new Promise((resolve) => {
    const call = typeof request === "function";
    const cancel = () => {
      controller.abort();
      resolve(fallbackResponse as T);
    };
    setTimeout(cancel, timeout);
    return call ? request().then(resolve) : request;
  });
}

function condenseErrors(errors?: GQLError[]) {
  const e = errors?.map(({ message }) => message).join("\n");
  return e;
}
