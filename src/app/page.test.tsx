import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PageContent } from "./PageContent";
import { PageAuthenticated } from "./PageAuthenticated";

vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({}),
}));

describe("PageContent", () => {
  beforeAll(() => {
    cleanup();
    render(<PageContent />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: /Bienvenue à toi/ })).toBeDefined();
  });

  test("Page has link to create character", async () => {
    const link = screen.getByRole("link", { name: /Démarrer la création/ });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/edit");
  });
});

describe("PageAuthenticated", () => {
  beforeAll(() => {
    cleanup();
    render(<PageAuthenticated characters={[]} />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 3, name: /Personnages récents/ })).toBeDefined();
  });

  test("Page has link to create character", async () => {
    const link = screen.getByRole("link", { name: /Démarrer la création/ });
    expect(link).toBeDefined();
    expect(link.attributes).toHaveProperty("href");
    expect(link.attributes.getNamedItem("href")).toBeDefined();

    const attribute = link.attributes.getNamedItem("href") as Attr;
    expect(attribute.value).toEqual("/edit");
  });
});
