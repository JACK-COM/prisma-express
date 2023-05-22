import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { API_BASE } from "utils";

type ResponseError = { message: string };

/** Generic Fetch options */
type RawFetchOpts<T> = {
  /** request content type */
  contentType?: string;
  /** server endpoint */
  url?: string;
  /** query string */
  additionalOpts?: AxiosRequestConfig;
  /** Cancel request after this amount of time (milliseconds) */
  timeout?: number;
  /** Function to call with the response */
  onResolve(x: T, errors?: string): any;
  /** Optional fallback value if response fails */
  fallbackResponse?: T;
};

/** Abstraction for making a simple fetch request */
export async function fetchRaw<T>(opts: RawFetchOpts<T>) {
  const {
    contentType = "application/json",
    url = API_BASE,
    onResolve,
    additionalOpts = {},
    timeout = 3500,
    fallbackResponse: fb = {} as T
  } = opts;
  const controller = new AbortController();
  const reqInit: AxiosRequestConfig = {
    method: "post",
    withCredentials: true,
    signal: controller.signal,
    headers:
      contentType === "application/json"
        ? new AxiosHeaders({ "Content-Type": contentType })
        : new AxiosHeaders({ Accept: "*/*" }),
    ...additionalOpts
  };

  const request = () =>
    axios(url, reqInit)
      .then((res) => res.data)
      .then((res) => onResolve(res || fb, condenseErrors(res.errors)))
      .catch((e) => onResolve({} as T, condenseErrors(e.errors || e)));
  const withTimeoutOpts = {
    request,
    timeout,
    fallbackResponse: fb,
    controller
  };

  return withTimeout(withTimeoutOpts).catch<string>((e) =>
    onResolve({} as T, e.message || e)
  );
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
  const { request, controller, timeout = 3500 } = opts;
  return new Promise((resolve, reject) => {
    const call = typeof request === "function";
    const cancel = () => {
      controller.abort();
      reject(new Error("Request timed out"));
    };
    setTimeout(cancel, timeout);
    return call ? request().then(resolve).catch(reject) : resolve(request);
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
