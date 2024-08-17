import { beforeAll, describe, expect, test, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { renderWithData } from "./helpers-test";
import { PageContent } from "./PageContent";

vi.mock("next/navigation", () => ({
  useParams: () => ({ character: 1 }),
  usePathname: () => "",
}));

describe("Page", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Introduction" })).toBeDefined();
  });
});
