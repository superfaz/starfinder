"use client";

import Col from "react-bootstrap/Col";
import { useCharacterPresenter } from "../helpers";
import { SpellsSelection } from "./SpellsSelection";

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
