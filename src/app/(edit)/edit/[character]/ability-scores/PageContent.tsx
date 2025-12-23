import Col from "react-bootstrap/Col";
import { AbilityScores } from "./AbilityScores";
import { Skills } from "./Skills";
import { SkillsModifiers } from "./SkillsModifiers";
import Languages from "./Languages";

export function PageContent() {
  return (
    <>
      <Col xs={12} sm={8} md={6} lg={4} xl={3} className="offset-sm-2 offset-md-0">
        <AbilityScores />
        <Languages />
      </Col>
      <Col xs={12} sm={8} md={6} lg={4} xl={3} className="offset-sm-2 offset-md-0">
        <Skills />
      </Col>
      <Col xs={12} sm={8} md={6} lg={4} xl={3} className="offset-sm-2 offset-md-0">
        <SkillsModifiers />
      </Col>
    </>
  );
}
