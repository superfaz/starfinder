"use client";

import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import { AbilityScores } from "./AbilityScores";
import { ProfessionSkills } from "./ProfessionSkills";
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
        <Stack direction="vertical" gap={4}>
          <AbilityScores />
          <ProfessionSkills />
        </Stack>
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
