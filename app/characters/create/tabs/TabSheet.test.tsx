import { beforeEach, describe, expect, test } from "vitest";
import { render, within } from "@testing-library/react";
import Page from "../page";

describe("TabSheet", () => {
  beforeEach(() => {
    render(<Page />);
  });

  test("Sheet is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Fiche de personnage" })).toBeNull();
  });
});
