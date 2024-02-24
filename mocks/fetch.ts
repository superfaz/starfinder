import { Response, Request } from "cross-fetch";

const cache: Record<string, object> = {};

export function addFetchMock(url: string, data: object): void {
  cache[url] = data;
}

export function mockFetch(input: string | URL | Request): Promise<Response> {
  let url: string;
  if (input instanceof Request) {
    url = input.url;
  } else if (input instanceof URL) {
    url = input.toString();
  } else {
    url = input;
  }

  if (cache[url]) {
    return Promise.resolve(new Response(JSON.stringify(cache[url])));
  } else {
    throw new Error(`No mock data for ${url}`);
  }
}
