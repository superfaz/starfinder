"use client";

import { Col } from "react-bootstrap";
import { SpellsSelection } from "./SpellsSelection";
import { useCharacterPresenter } from "../helpers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return (
    <Col lg={12}>
      <SpellsSelection />
    </Col>
  );
}
