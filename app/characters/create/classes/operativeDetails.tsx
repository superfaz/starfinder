import { Badge, Card, Col, Row } from "react-bootstrap";
import { Character, Context } from "../types";
import operativeData from "@/data/class-operative.json";
import ModifierComponent, { replace } from "../ModifierComponent";

const categories = {
  ex: "EXT",
  ma: "MAG",
  su: "SUR",
};

export default function OperativeClassDetails({ character, context }: { character: Character; context: Context }) {
  return Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
    <Row key={level} className="mb-3">
      <Col lg={1}>
        <Badge bg="secondary">Niv. {level}</Badge>
      </Col>
      {operativeData.features
        .filter((s) => s.level === level)
        .map((feature) => {
          let localContext = { ...context, ...feature.evolutions[level] };
          return (
            <Col key={feature.id}>
              <Card>
                <Card.Header>
                  {feature.name} {`${feature.category} (${categories[feature.category]})`}
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">{replace(localContext, feature.description)}</p>
                  {feature.modifiers.map((modifier) => (
                    <ModifierComponent key={modifier.id} component={modifier} context={localContext} />
                  ))}
                </Card.Body>
                <Card.Footer>
                  {Object.entries(feature.evolutions).map(([key, value]) => (
                    <div key={key}>
                      <Badge bg="secondary">{key}</Badge> Bonus +{value.bonus}
                    </div>
                  ))}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
    </Row>
  ));
}

/*
    <>
      <Row className="mb-3">
        
        <Col>
          <Card>
            <Card.Header>Spécialisation</Card.Header>
            <Card.Body>
              <div>
                <Badge bg="primary">Don</Badge>
                <strong>Talent</strong> Acrobatie
              </div>
              <div>
                <Badge bg="primary">Don</Badge>
                <strong>Talent</strong> Athlétisme
              </div>
              <div>
                <Badge bg="primary">Rang de compétence</Badge>
                <strong>+1</strong> Acrobatie
              </div>
              <div>
                <Badge bg="primary">Rang de compétence</Badge>
                <strong>+1</strong> Athlétisme
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>Feinte offensive (EXT)</Card.Header>
            <Card.Body>
              <div>Vous pouvez tromper ou surprendre un ennemi puis l’attaquer quand il baisse sa garde.</div>
              <Badge bg="primary">Pouvoir</Badge>
              En tant qu’action complexe, vous pouvez vous déplacer et/ou effectuer une attaque avec une arme de corps à
              corps ayant la propriété spéciale agent ou avec n’importe quelle arme légère. Juste avant de porter votre
              attaque, tentez un test de Bluff, d’Intimidation ou de Discrétion ou &lt;Specialization&gt; avec un DD de
              20 + le FP de la cible. Si vous réussissez ce test, vous infligez 1d4 points de dégâts supplémentaires et
              la cible est prise au dépourvu contre cette attaque.
            </Card.Body>
            <Card.Footer>
              <div>
                <Badge bg="secondary">1</Badge> Dégâts +1d4
              </div>
              <div>
                <Badge bg="secondary">3</Badge> Dégâts +1d8
              </div>
              <div>
                <Badge bg="secondary">5</Badge> Dégâts +3d8
              </div>
              <div>
                <Badge bg="secondary">7</Badge> Dégâts +4d8
              </div>
              <div>
                <Badge bg="secondary">9</Badge> Dégâts +5d8
              </div>
              <div>
                <Badge bg="secondary">11</Badge> Dégâts +6d8
              </div>
              <div>
                <Badge bg="secondary">13</Badge> Dégâts +7d8
              </div>
              <div>
                <Badge bg="secondary">15</Badge> Dégâts +8d8
              </div>
              <div>
                <Badge bg="secondary">17</Badge> Dégâts +9d8
              </div>
              <div>
                <Badge bg="secondary">19</Badge> Dégâts +10d8
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={1}>
          <Badge bg="secondary">Niv. 2</Badge>
        </Col>
        <Col>
          <Card>
            <Card.Header>Esquive totale (EXT)</Card.Header>
            <Card.Body>
              <Badge bg="primary">Pouvoir</Badge>
              Si vous réussissez un jet de Réflexes contre un effet qui, normalement, ne serait que partiel à cause
              d’une sauvegarde réussie, vous échappez totalement à cet effet. Vous bénéficiez de cet avantage uniquement
              lorsque vous n’êtes pas encombré et que vous ne portez aucune armure ou une armure légère. Vous perdez cet
              avantage quand vous êtes sans défense ou incapable de bouger.
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>Exploit d'agent</Card.Header>
            <Card.Body>
              <Badge bg="primary">Spécial</Badge>
              En gagnant de l’expérience, vous apprenez des techniques spéciales appelées des exploits d’agent.
            </Card.Body>
            <Card.Footer>
              <Badge bg="secondary">2</Badge>
              <Badge bg="secondary">4</Badge>
              <Badge bg="secondary">6</Badge>
              <Badge bg="secondary">8</Badge>
              <Badge bg="secondary">10</Badge>
              <Badge bg="secondary">12</Badge>
              <Badge bg="secondary">14</Badge>
              <Badge bg="secondary">16</Badge>
              <Badge bg="secondary">18</Badge>
              <Badge bg="secondary">20</Badge>
            </Card.Footer>
          </Card>
        </Col>
        <Col></Col>
      </Row>
      <Row className="mb-3">
        <Col lg={1}>
          <Badge bg="secondary">Niv. 3</Badge>
        </Col>
        <Col>
          <Card>
            <Card.Header>Esquive totale (EXT)</Card.Header>
            <Card.Body>
              <Badge bg="primary">Pouvoir</Badge>
              Si vous réussissez un jet de Réflexes contre un effet qui, normalement, ne serait que partiel à cause
              d’une sauvegarde réussie, vous échappez totalement à cet effet. Vous bénéficiez de cet avantage uniquement
              lorsque vous n’êtes pas encombré et que vous ne portez aucune armure ou une armure légère. Vous perdez cet
              avantage quand vous êtes sans défense ou incapable de bouger.
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>Exploit d'agent</Card.Header>
            <Card.Body>
              <Badge bg="primary">Spécial</Badge>
              En gagnant de l’expérience, vous apprenez des techniques spéciales appelées des exploits d’agent.
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
}
*/
