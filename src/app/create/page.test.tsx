import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useRouter: () => {},
}));

describe("/create", () => {
  beforeAll(() => {
    cleanup();
    render(<PageContent races={[]} themes={[]} classes={[]} />);
  });

  test("is live", async () => {
    expect(screen.getByRole("heading", { level: 1, name: "Concept de personnage" })).toBeDefined();
  });
});
