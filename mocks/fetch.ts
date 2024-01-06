import { Response, Request } from "cross-fetch";

const cache: Record<string, object> = {};

export function addFetchMock(url: string, data: object): void {
  cache[url] = data;
}

export function mockFetch(input: string | URL | Request, _: unknown): Promise<Response> {
  const url: string = input instanceof Request ? input.url : input instanceof URL ? input.toString() : input;
  if (cache[url]) {
    return Promise.resolve(new Response(JSON.stringify(cache[url])));
  } else {
    throw new Error(`No mock data for ${url}`);
  }
}
