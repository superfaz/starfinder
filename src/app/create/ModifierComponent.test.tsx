import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ModifierComponent from "./ModifierComponent";
import StoreProvider from "logic/StoreProvider";
import { DataSetBuilder, IClientDataSet, convert } from "data";
import { Modifier } from "view";

describe("ModifierComponent", () => {
  test("should adapt for spell", async () => {
    cleanup();
    const modifier: Modifier = { id: "test-spell", type: "spell", target: "20035fe3-5463-44a0-a249-97442472b147" };
    const data: IClientDataSet = await convert(await new DataSetBuilder().build());
    render(
      <StoreProvider data={data}>
        <ModifierComponent modifier={modifier} />
      </StoreProvider>
    );

    expect(screen.getByText("Technomancer level 1")).toBeDefined();
  });
});
