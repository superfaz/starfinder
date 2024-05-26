"use client";

import Col from "react-bootstrap/Col";
import { useCharacterPresenter } from "../helpers";
import { AbilityScores } from "./AbilityScores";
import { Skills } from "./Skills";
import { SkillsModifiers } from "./SkillsModifiers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }
  return (
    <>
      <Col lg={4}>
        <AbilityScores />
      </Col>
      <Col lg={4}>
        <Skills />
      </Col>
      <Col lg={4}>
        <SkillsModifiers />
      </Col>
    </>
  );
}
