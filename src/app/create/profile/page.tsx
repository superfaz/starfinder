"use client";

import Col from "react-bootstrap/Col";
import { useCharacterPresenter } from "../helpers";
import { Profile } from "./Profile";
import { Avatar } from "./Avatar";
import { Description } from "./Description";

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
