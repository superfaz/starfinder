import { beforeAll, describe, expect, test } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { renderWithData } from "./helpers-test";
import { PageContent } from "./PageContent";

describe("Page", () => {
  beforeAll(async () => {
    cleanup();
    await renderWithData(<PageContent />);
  });

  test("Page is live", async () => {
    expect(screen.getByRole("heading", { level: 2, name: "Introduction" })).toBeDefined();
  });
});
