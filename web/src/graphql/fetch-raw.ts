type ResponseError = { message: string };

/** Generic Fetch options */
type RawFetchOpts<T> = {
  /** request content type */
  contentType?: string;
  /** server endpoint */
  url?: string;
  /** query string */
  additionalOpts?: RequestInit;
  /** Function to call with the response */
  onResolve(x: T, errors?: string): any;
  /** Optional fallback value if response fails */
  fallbackResponse?: T;
};

/** Abstraction for making a simple fetch request */
export async function fetchRaw<T>(opts: RawFetchOpts<T>) {
  const {
    contentType = "application/json",
    url = "http://localhost:4001",
    onResolve,
    additionalOpts = {},
    fallbackResponse: fallback = {} as T
  } = opts;
  const controller = new AbortController();
  const reqInit: RequestInit = {
    method: "post",
    credentials: "include",
    signal: controller.signal,
    ...additionalOpts
  };

  if (contentType === "application/json") {
    reqInit.headers = new Headers({ "Content-Type": contentType });
  } else reqInit.headers = new Headers({ Accept: "*/*" });

  const request = () =>
    fetch(url, reqInit)
      .then((res) => res.json())
      .then((res) => onResolve(res || fallback, condenseErrors(res.errors)))
      .catch((e) => onResolve({} as T, condenseErrors(e.errors || e)));

  return withTimeout({ request, fallbackResponse: fallback, controller });
}
export default fetchRaw;

/** Props for making a cancellable http request */
export type CancelableProps<T> = {
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

export function condenseErrors(errors?: ResponseError[] | Error) {
  if (!errors) return undefined;
  if ((errors as Error).message) return (errors as Error).message;
  if (Array.isArray(errors)) {
    const e = (errors as ResponseError[])
      .map(({ message }) => message)
      .join("\n");
    return e;
  }
  if (typeof errors === "string") return errors;
  console.log("Unknown network error", errors);
  return "Network fetch error";
}
