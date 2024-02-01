import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
  beforeAll(async () => {
    cleanup();
    render(await Page());
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Création de personnage" })).toBeDefined();
  });
});
