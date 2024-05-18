"use client";

import Col from "react-bootstrap/Col";
import { useCharacterPresenter } from "../helpers";
import { EquipmentSelection } from "./EquipmentSelection";
import { EquipmentSelected } from "./EquipmentSelected";

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
