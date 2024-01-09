import { Badge, Card, Col, Row, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { CharacterPresenter, computeAbilityScoreModifier, useAppSelector } from "logic";
import { Alignment, ModifierType } from "model";
import { CharacterProps } from "../Props";

interface IValueComponentProps {
  label: string;
  value?: string | number;
  title?: string;
  className?: string;
  children?: JSX.Element[] | JSX.Element;
}

type ValueComponentProps = Readonly<IValueComponentProps>;

interface ISheetProps {
  data: IClientDataSet;
  character: CharacterPresenter;
}

type SheetProps = Readonly<ISheetProps>;

function ValueComponent({ label, value, title, className, children }: ValueComponentProps) {
  return (
    <div className={className} title={title}>
      {children && <div className="header">{children}</div>}
      {!children && <div className="header">{value === undefined || value === "" ? "-" : value}</div>}
      <div className="small text-muted border-top border-secondary">{label}</div>
    </div>
  );
}

function CardProfile({ data, character }: SheetProps) {
  const alignment: Alignment | undefined = data.alignments.find((a) => a.id === character.getAlignment());

  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Profil</Badge>
      </Card.Header>
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <ValueComponent label="Nom du personnage" value={character.getName()} />
          <Row>
            <ValueComponent label="Classe" className="col-8" value={character.getClass()?.name} />
            <ValueComponent label="Niveau" className="col-4" value={character.getCharacter().level} />
          </Row>
          <ValueComponent label="Race" value={character.getRace()?.name} />
          <ValueComponent label="Thème" value={character.getTheme()?.name} />
          <Row>
            <ValueComponent label="Taille" className="col" value={"Normale"} />
            <ValueComponent label="Vitesse" className="col" value={"Normale"} />
            <ValueComponent label="Sexe" className="col-3" value={character.getSex()} />
          </Row>
          <ValueComponent label="Monde natal" value={character.getHomeWorld()} />
          <Row>
            <ValueComponent
              label="Alignement"
              className="col-4"
              value={alignment?.code ?? ""}
              title={alignment?.name ?? undefined}
            />
            <ValueComponent label="Divinité" className="col" value={character.getDeity()} />
          </Row>
        </Stack>
      </Card.Body>
    </Card>
  );
}

function CardAbilityScores({ data, character }: SheetProps) {
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

function CardSkills({ data, character }: SheetProps) {
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

function CardSavingThrows({ character }: CharacterProps) {
  const modifiers = character.getModifiers().filter((m) => m.type === ModifierType.savingThrow);
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Jets de sauvegarde</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
      {modifiers.length > 0 && (
        <Card.Footer className="small">
          <Stack gap={2}>
            {modifiers.map((modifier) => (
              <div key={modifier.id}>
                <strong className="me-2">{modifier.name}.</strong>
                <span className="text-muted">{modifier.description}</span>
              </div>
            ))}
          </Stack>
        </Card.Footer>
      )}
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
        <Badge bg="primary">Armes</Badge>
      </Card.Header>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardAbilities({ character }: CharacterProps) {
  const modifiers = character.getModifiers().filter((m) => m.type === ModifierType.ability);
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Pouvoirs</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {modifiers.map((modifier) => (
            <div key={modifier.id}>
              <strong className="me-2">{modifier.name}.</strong>
              <span className="text-muted">{modifier.description}</span>
            </div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}

export function Sheet({ character }: CharacterProps) {
  const data = useAppSelector((state) => state.data);

  return (
    <Row>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardProfile data={data} character={character} />
          <CardAbilityScores data={data} character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardSkills data={data} character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardKeyPoints />
          <CardSavingThrows character={character} />
          <CardArmorClass />
          <CardAttackBonus />
          <CardWeapons />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardAbilities character={character} />
        </Stack>
      </Col>
    </Row>
  );
}
