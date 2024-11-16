import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

vi.mock("@kinde-oss/kinde-auth-nextjs/server", () => ({
  getKindeServerSession: () => ({}),
}));

describe("/edit/class", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("is not displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).toBeNull();
  });
});

describe("/edit/class", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter().updateRace("androids").updateTheme("bounty-hunter").character;
    await renderWithData(<PageContent />, character);
  });

  test("is displayed", async () => {
    const content = within(document.querySelector("#content") as HTMLElement);
    expect(content.queryByRole("heading", { level: 2, name: "Classe" })).not.toBeNull();
  });

  const classes = [
    { id: "operative", expected: "Spécialisation" },
    { id: "soldier", expected: "Don de combat" },
  ];
  test.each(classes)("displays details for class '$id'", async (klass) => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole("combobox", { name: "Classe" }), klass.id);

    const content = within(document.querySelector("#content") as HTMLElement);
    const view = content.getByRole("heading", { level: 2, name: "Abilités de classe" }).parentElement;
    if (view === null) {
      throw new Error("view is null");
    }

    await waitFor(() => within(view).getByRole("heading", { name: klass.expected }), { timeout: 1000 });
    expect(within(view).getByRole("heading", { name: klass.expected })).not.toBeNull();
  });
});
