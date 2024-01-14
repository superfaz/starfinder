import { describe, expect, test } from "@jest/globals";
import { isAbilityScore } from "./AbilityScore";

describe("isAbilityScore", () => {
  const accepted = ["str", "dex", "con", "int", "wis", "cha"];
  const refused = [
    "operative",
    "class-operative",
    "66a6de23-2791-4b6f-a67f-83fedd2a0759",
    "",
    null,
    undefined,
    "123",
    "TEST",
    "class-",
  ];

  test.each(accepted)("is accepting id like '%s'", (testedId) => {
    expect(isAbilityScore({ id: testedId, code: "code", name: "name" })).toBe(true);
  });

  test.each(refused)("is refusing id like '%s'", (testedId) => {
    expect(isAbilityScore({ id: testedId, code: "code", name: "name" })).toBe(false);
  });
});
