import fs from "node:fs";
import { prettyDOM, waitFor } from "@testing-library/dom";

export const dump = (element: Element | Document | undefined) => {
  fs.mkdirSync("dump", { recursive: true });
  fs.writeFileSync(`dump/${Date.now()}.html`, prettyDOM(element, 1000000, { highlight: false }) || "");
};

export const waitForWithDump: typeof waitFor = (callback, options) => {
  return waitFor(callback, {
    ...options,
    onTimeout: (error) => {
      dump(options?.container);
      return options?.onTimeout?.(error) ?? error;
    },
  });
};
