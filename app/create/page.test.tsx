import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
  beforeEach(() => {
    render(<Page />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Création de personnage" })).toBeDefined();
  });
});
