import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import Page from "./page";
import { renderWithData } from "./helpers-test";

describe("Page", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<Page />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Création de personnage" })).toBeDefined();
  });
});
