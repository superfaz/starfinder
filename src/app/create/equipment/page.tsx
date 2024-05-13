"use client";

import { EquipmentSelection } from "./EquipmentSelection";
import { useCharacterPresenter } from "../helpers";
import { EquipmentSelected } from "./EquipmentSelected";
import { Col } from "react-bootstrap";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <EquipmentSelected />
      </Col>
      <Col>
        <EquipmentSelection />
      </Col>
    </>
  );
}
