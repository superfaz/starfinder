"use client";

import { Col } from "react-bootstrap";
import { Profile } from "./Profile";
import { Avatar } from "./Avatar";
import { Description } from "./Description";
import { useCharacterPresenter } from "../helpers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return (
    <>
      <Col lg={3}>
        <Profile />
      </Col>
      <Col lg={3}>
        <Avatar />
      </Col>
      <Col lg={6}>
        <Description />
      </Col>
    </>
  );
}
