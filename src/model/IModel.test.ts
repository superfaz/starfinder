import { describe, expect, test } from "vitest";
import { IModelSchema, isIModel } from "./IModel";

describe("isIModel", () => {
  const accepted = ["operative", "class-operative", "66a6de23-2791-4b6f-a67f-83fedd2a0759"];
  const refused = ["", null, undefined, "123", "TEST", "class-"];

  test.each(accepted)("is accepting id like '%s'", (testedId) => {
    expect(isIModel({ id: testedId })).toBe(true);
  });

  test.each(refused)("is refusing id like '%s'", (testedId) => {
    expect(isIModel({ id: testedId })).toBe(false);
  });

  test("is accepting complex object", () => {
    expect(isIModel({ id: "tested-id", name: "tested name" })).toBe(true);
  });
});

describe("IModel", () => {
  test("is reducing object after parsing", () => {
    const actual = IModelSchema.safeParse({ id: "tested-id", name: "tested name" });
    expect(actual.success).toBe(true);
    if (actual.success) {
      expect(IModelSchema.strict().safeParse(actual.data).success).toBe(true);
    }
  });
});
