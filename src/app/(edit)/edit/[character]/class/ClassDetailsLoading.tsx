import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import { Card, Badge } from "ui";

export default function ClassDetailsLoading() {
  return (
    <Row>
      <Col lg={1}>
        <Badge bg="secondary">Niv. 1</Badge>
      </Col>
      <Col>
        <Card>
          <Card.Header role="heading" className="placeholder-glow">
            <Placeholder xs={5} />
            <Placeholder xs={4} />
          </Card.Header>
          <Card.Body className="placeholder-glow">
            <Placeholder xs={10} />
            <Placeholder xs={7} />
            <Placeholder xs={4} />
            <Placeholder xs={4} />
            <Placeholder xs={5} />
          </Card.Body>
        </Card>
      </Col>
      <Col></Col>
      <Col></Col>
    </Row>
  );
}
