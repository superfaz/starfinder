import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, within } from "@testing-library/react";
import Page from "../page";

describe("TabIntro", () => {
  beforeEach(() => {
    render(<Page />);
  });

  test("Intro is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Introduction" })).not.toBeNull();
  });
});
