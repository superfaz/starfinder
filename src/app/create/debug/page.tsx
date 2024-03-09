"use client";

import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CookiesProvider, useCookies } from "react-cookie";
import { Character, CharacterSchema, EmptyCharacter } from "model";

export const dynamic = "force-dynamic";

function Client() {
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
    <Row>
      <Col lg={12}>
        <h5>Character</h5>
        <pre>{JSON.stringify(character, null, 2)}</pre>
      </Col>
    </Row>
  );
}

export default function Page() {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "strict" }}>
      <Client />
    </CookiesProvider>
  );
}
