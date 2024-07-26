import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus } from "app/helpers";
import { ICharacterPresenter } from "logic";

export function CardSkills({ presenter }: Readonly<{ presenter: ICharacterPresenter }>) {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Compétences</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Stack direction="vertical" gap={2}>
          {presenter.getSkills().map((skill) => {
            return (
              <Row key={skill.id}>
                <Col xs="auto" className="pe-0 me-0">
                  {skill.isClassSkill && <i className="bi bi-star text-gold me-1" title="Compétence de classe"></i>}
                  {!skill.isClassSkill && <i className="bi bi-empty me-1"></i>}
                </Col>
                <Col className="px-0 mx-0 pe-3">
                  <span className="me-1">{skill.fullName}</span>
                  {skill.definition.trainedOnly && (
                    <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
                  )}
                  {skill.definition.armorCheckPenalty && (
                    <i
                      className="bi bi-shield-shaded text-secondary me-1"
                      title="Le malus d’armure aux tests s’applique"
                    ></i>
                  )}
                </Col>
                <Col xs="1" className="ps-0 ms-0">
                  {skill.bonus !== undefined && (
                    <Badge bg={skill.bonus > 0 ? "primary" : "secondary"} className="position-absolute end-0 me-3">
                      {displayBonus(skill.bonus)}
                    </Badge>
                  )}
                </Col>
              </Row>
            );
          })}
        </Stack>
      </Card.Body>
    </Card>
  );
}
