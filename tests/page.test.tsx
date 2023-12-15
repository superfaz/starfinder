import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

describe("Page", () => {
  beforeEach(() => {
    render(<Page />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Bienvenue !" })).toBeDefined();
  });

  test("Page has link to create character", async () => {
    expect(screen.getByRole("link", { name: "Créer un personnage" })).toBeDefined();
  });
});
