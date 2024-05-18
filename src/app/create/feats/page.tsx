"use client";

import Col from "react-bootstrap/Col";
import { useCharacterPresenter } from "../helpers";
import { FeatsInherited } from "./FeatsInherited";
import { FeatsSelected } from "./FeatsSelected";
import { FeatsSelection } from "./FeatsSelection";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <FeatsInherited />
        <FeatsSelected />
      </Col>
      <Col>
        <FeatsSelection />
      </Col>
    </>
  );
}
