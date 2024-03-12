"use client";

import { Col } from "react-bootstrap";
import { ClassSelection } from "./ClassSelection";
import { ClassDetails } from "./ClassDetails";
import { useCharacterPresenter } from "../helpers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <ClassSelection />
      </Col>
      <Col>
        <ClassDetails />
      </Col>
    </>
  );
}
