"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Character, CharacterSchema } from "model";

export function Client() {
  const [cookies] = useCookies(["character"]);
  const [character, setCharacter] = useState<Character | undefined>();

  useEffect(() => {
    if (cookies.character !== undefined) {
      const parse = CharacterSchema.safeParse(cookies.character);
      if (parse.success) {
        setCharacter(parse.data);
      }
    }
  }, [cookies, cookies.character]);

  return (
    <>
      <h5>Character</h5>
      <pre>{JSON.stringify(character, null, 2)}</pre>
    </>
  );
}
