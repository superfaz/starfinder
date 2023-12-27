import { beforeEach, describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
  beforeEach(() => {
    render(<Page />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Bienvenue !" })).toBeDefined();
  });

  test("Page has link to create character", async () => {
    const link = screen.getByRole("link", { name: "Créer un personnage" });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/create");
  });
});
