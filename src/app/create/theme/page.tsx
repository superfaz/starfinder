"use client";

import Col from "react-bootstrap/Col";
import { ThemeSelection } from "./ThemeSelection";
import { ThemeTraits } from "./ThemeTraits";
import { useCharacterPresenter } from "../helpers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <ThemeSelection />
      </Col>
      <Col>
        <ThemeTraits />
      </Col>
    </>
  );
}
