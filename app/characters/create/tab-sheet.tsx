import { Badge, Card, Col, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { DataSet } from "data";
import { CharacterPresenter, computeAbilityScoreModifier } from "logic";

function ValueComponent({
  label,
  value,
  title,
  className,
  children,
}: {
  label: string;
  value?: string | number | undefined;
  title?: string;
  className?: string;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <div className={className} title={title}>
      <div className="header">{children ?? value ?? "-"}</div>
      <div className="small text-muted border-top border-secondary">{label}</div>
    </div>
  );
}

function CardProfile({ character }: { character: CharacterPresenter }) {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Profil</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <ValueComponent label="Nom du personnage" value={"test de nom"} />
          <Row>
            <ValueComponent label="Classe" className="col-8" value={character.getClass()?.name} />
            <ValueComponent label="Niveau" className="col-4" value={character.getCharacter().level} />
          </Row>
          <ValueComponent label="Race" value={character.getRace()?.name} />
          <ValueComponent label="Thème" value={character.getTheme()?.name} />
          <Row>
            <ValueComponent label="Taille" className="col" value={"Normale"} />
            <ValueComponent label="Vitesse" className="col" value={"Normale"} />
            <ValueComponent label="Sexe" className="col-3" value={"X"} />
          </Row>
          <ValueComponent label="Monde natal" value={"Test"} />
          <Row>
            <ValueComponent label="Alignement" className="col-4" value={"LN"} title={"Loyal Neutre"} />
            <ValueComponent label="Divinité" className="col" value={"test"} />
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
}

function CardAbilityScores({ data, character }: { data: DataSet; character: CharacterPresenter }) {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Caractérisques</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          {[
            [0, 3],
            [3, 6],
          ].map(([min, max]) => (
            <Row key={max}>
              {data.abilityScores.slice(min, max).map((a) => {
                const bonus = computeAbilityScoreModifier(character.getAbilityScores()[a.id]);
                return (
                  <ValueComponent key={a.id} label={a.name} className="col">
                    <div className="position-relative">
                      <span>{character.getAbilityScores()[a.id]}</span>
                      <Badge bg={bonus > 0 ? "primary" : "secondary"} className="position-absolute end-0 me-0">
                        {displayBonus(bonus)}
                      </Badge>
                    </div>
                  </ValueComponent>
                );
              })}
            </Row>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function CardSkills({ data, character }: { data: DataSet; character: CharacterPresenter }) {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Compétences</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Stack direction="vertical" gap={2}>
          {character.getSkills().map((skill) => {
            return (
              <div key={skill.id}>
                {skill.isClassSkill && <i className="bi bi-star text-gold me-1" title="Compétence de classe"></i>}
                {!skill.isClassSkill && <i className="bi bi-empty me-1"></i>}
                <span className="header me-1">{skill.definition.name}</span>
                {skill.definition.abilityScore && (
                  <span className="me-1">
                    ({findOrError(data.abilityScores, (a) => a.id === skill.definition.abilityScore).code})
                  </span>
                )}
                {skill.definition.trainedOnly && (
                  <i className="bi bi-mortarboard-fill text-secondary me-1" title="Formation nécessaire"></i>
                )}
                {skill.definition.armorCheckPenalty && (
                  <i
                    className="bi bi-shield-shaded text-secondary me-1"
                    title="Le malus d’armure aux tests s’applique"
                  ></i>
                )}
                {skill.bonus !== undefined && (
                  <Badge bg={skill.bonus > 0 ? "primary" : "secondary"} className="position-absolute end-0 me-3">
                    {displayBonus(skill.bonus)}
                  </Badge>
                )}
              </div>
            );
          })}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function CardKeyPoints() {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Valeurs clefs</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardSavingThrows() {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Jets de sauvegarde</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardArmorClass() {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Classe d&apos;armure</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardAttackBonus() {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Bonus d&apos;attaque</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardWeapons() {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Bonus d&apos;attaque</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardAbilities({ character }: { character: CharacterPresenter }) {
  const modifiers = character.getModifiers().filter((m) => m.type === "ability");
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Pouvoirs</Badge>
      </Card.Header>
      <Card.Body className="small">
        {modifiers.map((modifier) => (
          <div key={modifier.id} className="mb-2">
            <strong className="me-2">{modifier.name}.</strong>
            <span className="text-muted">{modifier.description}</span>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}

export function TabSheet({ data, character }: { data: DataSet; character: CharacterPresenter }) {
  return (
    <Row>
      <Col lg={3}>
        <CardProfile character={character} />
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardAbilityScores data={data} character={character} />
          <CardSkills data={data} character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardKeyPoints />
          <CardSavingThrows />
          <CardArmorClass />
          <CardAttackBonus />
          <CardWeapons />
        </Stack>
      </Col>
      <Col lg={3}>
        <CardAbilities character={character} />
      </Col>
    </Row>
  );
}
