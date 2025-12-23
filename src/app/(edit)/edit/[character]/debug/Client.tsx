"use client";

import { useAppSelector } from "logic";

export function Client() {
  const character = useAppSelector((state) => state.character);

  return (
    <>
      <h5>Character</h5>
      <pre>{JSON.stringify(character, null, 2)}</pre>
    </>
  );
}
