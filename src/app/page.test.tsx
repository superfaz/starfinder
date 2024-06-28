import { UserProvider } from "@auth0/nextjs-auth0/client";
import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
  beforeAll(() => {
    cleanup();
    render(
      <UserProvider>
        <Page />
      </UserProvider>
    );
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
    expect(attribute.value).toEqual("/create");
  });
});
