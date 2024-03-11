import { CharacterPresenter, mutators, useAppDispatch } from "logic";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Feat } from "view";
import { FeatComponentBody } from "./FeatComponentBody";

export function FeatComponent({
  presenter,
  feat,
  noAction = false,
}: Readonly<{ presenter: CharacterPresenter; feat: Feat; noAction?: boolean }>) {
  const dispatch = useAppDispatch();

  function handleRemoveFeat() {
    dispatch(mutators.removeFeat({ id: feat.id, target: feat.target }));
  }

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            {feat.name}
            {feat.combatFeat ? " (combat)" : ""}
          </Col>
          {!noAction && (
            <Col xs="auto">
              <Button size="sm" onClick={handleRemoveFeat}>
                Enlever
              </Button>
            </Col>
          )}
        </Row>
      </Card.Header>
      <FeatComponentBody character={presenter} feat={feat} />
    </Card>
  );
}
