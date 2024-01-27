import { Card, Row } from "react-bootstrap";
import ModifierComponent from "../ModifierComponent";
import { CharacterProps } from "../Props";

export function Feats({ character }: CharacterProps) {
  return (
    <>
      <h2>Dons disponibles</h2>
      <Row>
        {character.getAllFeats().map((feat) => (
          <div key={feat.id} className="col-4 mb-4">
            <Card key={feat.id}>
              <Card.Header className={feat.available ? undefined : "text-danger"}>
                {feat.name}
                {feat.combatFeat ? " (combat)" : ""}
              </Card.Header>
              <Card.Body>
                {feat.description && <p className="text-muted">{feat.description}</p>}
                {feat.modifiers.map((modifier) => (
                  <ModifierComponent key={modifier.id} modifier={modifier} />
                ))}
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </>
  );
}
