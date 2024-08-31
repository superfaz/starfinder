import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";
import { createCharacter } from "./edit/[character]/helpers-test";
import { CharacterVM } from "./edit/viewmodel";

vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({}),
}));

describe("PageContent", () => {
  beforeAll(() => {
    cleanup();
    render(<PageContent />);
  });

  test("is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: /Bienvenue à toi/ })).toBeDefined();
  });

  test("has link to create character", async () => {
    const link = screen.getByRole("link", { name: /Démarrer la création/ });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/edit");
  });
});

describe("PageAuthenticated - new user", () => {
  beforeAll(() => {
    cleanup();
    render(<PageAuthenticated characters={[]} />);
  });

  test("is live", async () => {
    expect(screen.getByRole("heading", { level: 3, name: /Créer/ })).toBeVisible();
  });

  test("doesn't display welcome", async () => {
    expect(screen.queryByRole("heading", { level: 1, name: /Bienvenue à toi/ })).toBeNull();
  });

  test("doesn't display recent characters", async () => {
    expect(screen.queryByRole("heading", { level: 3, name: /Personnages récents/ })).toBeNull();
  });

  test("has link to create character", async () => {
    const link = screen.getByRole("link", { name: /Démarrer la création/ });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/edit");
  });
});

describe("PageAuthenticated - existing user", () => {
  beforeAll(() => {
    cleanup();
    const character: CharacterVM = { id: "1", name: "Test" };
    render(<PageAuthenticated characters={[character]} />);
  });

  test("is live", async () => {
    expect(screen.getByRole("heading", { level: 3, name: /Créer/ })).toBeVisible();
  });

  test("doesn't display welcome", async () => {
    expect(screen.queryByRole("heading", { level: 1, name: /Bienvenue à toi/ })).toBeNull();
  });

  test("display recent characters", async () => {
    expect(screen.getByRole("heading", { level: 3, name: /Personnages récents/ })).toBeVisible();
  });

  test("has link to create character", async () => {
    const link = screen.getByRole("link", { name: /Démarrer la création/ });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/edit");
  });
});
