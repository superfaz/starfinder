import Col from "react-bootstrap/Col";
import { AbilityScores } from "./AbilityScores";
import { Skills } from "./Skills";
import { SkillsModifiers } from "./SkillsModifiers";
import Languages from "./Languages";

export function PageContent() {
  return (
    <>
      <Col lg={4}>
        <AbilityScores />
        <Languages />
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
