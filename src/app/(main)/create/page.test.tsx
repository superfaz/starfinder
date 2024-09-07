import { beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Race } from "model";
import { ViewBuilder } from "view/server";
import books from "../../../../mocks/books.json";
import races from "../../../../mocks/races.json";
import themes from "../../../../mocks/themes.json";
import classes from "../../../../mocks/classes.json";
import { addFetchMock } from "../../../../mocks/fetch";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("/create", () => {
  beforeEach(() => {
    cleanup();

    const builder = new ViewBuilder();
    render(
      <PageContent
        books={books}
        races={builder.createRaceEntry(races as Race[])}
        themes={builder.createEntry(themes)}
        classes={builder.createEntry(classes)}
      />
    );
  });

  test("is live and empty by default", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Concept de personnage" })).toBeDefined();
    expect(screen.getByRole("textbox", { name: /Concept/ })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: /Nom/ })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: /Race/ })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: /Thème/ })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: /Classe/ })).toHaveValue("");
  });

  test("manage errors", async () => {
    addFetchMock(
      "/api/create",
      {
        name: "Invalid",
        race: "Invalid",
        theme: "Invalid",
        class: "Invalid",
      },
      400
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Démarrer/ }));

    expect(screen.getByRole("textbox", { name: /Nom/ })).toBeInvalid();
    expect(screen.getByRole("combobox", { name: /Race/ })).toBeInvalid();
    expect(screen.getByRole("combobox", { name: /Thème/ })).toBeInvalid();
    expect(screen.getByRole("combobox", { name: /Classe/ })).toBeInvalid();
  });
});
