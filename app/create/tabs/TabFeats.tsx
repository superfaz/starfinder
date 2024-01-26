import { useAppSelector } from "logic";
import { Card, Row } from "react-bootstrap";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";

export function Feats({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);
  return (
    <>
      <h2>Dons disponibles</h2>
      <Row>
        {data.feats.map((feat) => (
          <div key={feat.id} className="col-4 mb-4">
            <Card key={feat.id}>
              <Card.Header>{feat.name}</Card.Header>
              <Card.Body>
                {feat.description && <p className="text-muted">{feat.description}</p>}
                {feat.modifiers.map((template) => {
                  const templater = character.createTemplater();
                  const modifier = templater.convertModifier(template);
                  return <ModifierComponent key={modifier.id} modifier={modifier} />;
                })}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </>
  );
}
