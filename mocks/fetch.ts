import { Response, Request } from "cross-fetch";

const cache: Record<string, { body: object; status: number }> = {};

export function addFetchMock(url: string, body: object, status: number = 200): void {
  cache[url] = { body, status };
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
    return Promise.resolve(new Response(JSON.stringify(cache[url].body), { status: cache[url].status }));
  } else {
    throw new Error(`No mock data for ${url}`);
  }
}
