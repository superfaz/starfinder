import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

describe("/create/drone", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("is displayed", async () => {
    expect(screen.queryByRole("heading", { level: 2, name: "Drone" })).not.toBeNull();
  });
});

describe("/create/drone", () => {
  beforeAll(async () => {
    cleanup();
    const character = createCharacter()
      .updateRace("androids")
      .updateTheme("bounty-hunter")
      .updateClass("mechanic").character;
    await renderWithData(<PageContent />, character);
  });

  test("displays ChassisSelection", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Drone" })).toBeDefined();
  });

  test("updates the details while changing the chassis", async () => {
    const user = userEvent.setup();
    await waitFor(() => expect(screen.queryAllByText("Loading...")).toHaveLength(0), { timeout: 5000 });
    await user.selectOptions(screen.getByRole("combobox", { name: /chassis/i }), "hover");

    expect(within(screen.getByTestId("profile")).queryByText("Drone volant")).toBeDefined();
  });
});
