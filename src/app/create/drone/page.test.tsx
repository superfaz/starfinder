import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createCharacter, renderWithData } from "../helpers-test";
import { PageContent } from "./PageContent";

describe("/create/drone", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("is displayed", async () => {
    expect(screen.queryByRole("heading", { level: 2, name: "Chassis" })).not.toBeNull();
    expect(screen.queryByRole("heading", { level: 2, name: "Détails du drone" })).not.toBeNull();
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
    expect(screen.getByRole("heading", { level: 2, name: "Chassis" })).toBeDefined();
  });

  test("displays DroneSheet", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Détails du drone" })).toBeDefined();
  });

  test("updates the details while changing the chassis", async () => {
    const user = userEvent.setup();
    await waitFor(() => expect(screen.queryAllByText("Loading...")).toHaveLength(0));
    await user.selectOptions(screen.getByRole("combobox", { name: "Chassis" }), "hover");

    expect(within(screen.getByTestId("profile")).queryByText("Drone flottant")).toBeDefined();
  });
});
