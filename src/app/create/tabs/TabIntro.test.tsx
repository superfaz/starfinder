import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import Page from "../page";
import Layout from "../layout";

describe("TabIntro", () => {
  beforeAll(async () => {
    cleanup();
    render(await Layout({ children: <Page /> }));
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Introduction" })).not.toBeNull();
  });
});
