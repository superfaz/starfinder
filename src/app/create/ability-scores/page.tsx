import { Col, Stack } from "react-bootstrap";
import { AbilityScores } from "./AbilityScores";
import { ProfessionSkills } from "./ProfessionSkills";
import { Skills } from "./Skills";
import { SkillsModifiers } from "./SkillsModifiers";

export default function Page() {
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
