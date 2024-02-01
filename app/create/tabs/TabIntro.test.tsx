import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import Page from "../page";

describe("TabIntro", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Introduction" })).not.toBeNull();
  });
});
