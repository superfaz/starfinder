import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { displayBonus, findOrError } from "app/helpers";
import { IClientDataSet } from "data";
import { CharacterPresenter, computeAbilityScoreModifier, useAppSelector } from "logic";
import { type Alignment, ModifierTypes } from "model";
import { ofType } from "view";
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
    <div className={className} title={title} data-testid={label}>
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

function CardAvatar({ character }: CharacterProps) {
  const avatar = character.getAvatar();
  return (
    <Card data-testid="avatar">
      <Card.Header>
        <Badge bg="primary">Avatar</Badge>
      </Card.Header>
      {!avatar && (
        <Card.Body className="small">
          <em>Pas de race sélectionnée</em>
        </Card.Body>
      )}
      {avatar && (
        <picture>
          <img alt="avatar" src={"/" + avatar.image} className="img-fluid" />
        </picture>
      )}
    </Card>
  );
}

function CardDescription({ character }: CharacterProps) {
  const description = character.getDescription();
  return (
    <Card data-testid="description">
      <Card.Header>
        <Badge bg="primary">Biographie & Description</Badge>
      </Card.Header>
      <Card.Body className="small">
        {!description && <em>Pas de description définie</em>}
        {description}
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

function CardInitiative({ character }: CharacterProps) {
  const initiative = character.getInitiative();
  return (
    <Card data-testid="initiative">
      <Card.Header>
        <Row>
          <Col xs="auto">
            <Badge bg="primary">Initiative</Badge>
          </Col>
          <Col className="text-end pe-1">
            <Badge bg={initiative > 0 ? "primary" : "secondary"}>{displayBonus(initiative)}</Badge>
          </Col>
        </Row>
      </Card.Header>
    </Card>
  );
}

function CardSkills({ character }: CharacterProps) {
  return (
    <Card>
      <Card.Header>
        <Badge bg="primary">Compétences</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Stack direction="vertical" gap={2}>
          {character.getSkills().map((skill) => {
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

function CardKeyPoints({ character }: CharacterProps) {
  const keyPoints = {
    stamina: { max: character.getStaminaPoints(), label: "Points d'endurance" },
    hit: { max: character.getHitPoints(), label: "Points de vie" },
    resolve: { max: character.getResolvePoints(), label: "Points de persévérance" },
  };

  return (
    <Card data-testid="keypoints">
      <Card.Header>
        <Badge bg="primary">Santé et persévérance</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Row>
          {Object.entries(keyPoints).map(([key, value]) => (
            <ValueComponent key={key} label={value.label} className="col" value={value.max} />
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

function CardSavingThrows({ data, character }: SheetProps) {
  const selectedClass = character.getClass();
  const modifiers = character.getModifiers().filter(ofType(ModifierTypes.savingThrow));

  return (
    <Card data-testid="savingThrows">
      <Card.Header>
        <Badge bg="primary">Jets de sauvegarde</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        <Row>
          {!selectedClass && (
            <div className="small">
              <em>Pas de classe sélectionnée</em>
            </div>
          )}
          {selectedClass &&
            data.savingThrows.map((savingThrow) => {
              const bonus = character.getSavingThrowBonus(savingThrow);
              return (
                bonus !== undefined && (
                  <ValueComponent key={savingThrow.id} label={savingThrow.name} className="col">
                    <Badge bg={bonus > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                      {displayBonus(bonus)}
                    </Badge>
                  </ValueComponent>
                )
              );
            })}
        </Row>
      </Card.Body>
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

function CardArmorClass({ data, character }: SheetProps) {
  const proficiencies = character.getArmorProficiencies();
  const texts = proficiencies.map((p) => findOrError(data.armors, p).name);
  const armorClasses = {
    energy: { value: character.getEnergyArmorClass(), label: "Classe d’armure énergétique" },
    kinetic: { value: character.getKineticArmorClass(), label: "Classe d’armure cinétique" },
    maneuvers: { value: character.getArmorClassAgainstCombatManeuvers(), label: "CA vs manoeuvres offensives" },
  };
  return (
    <Card data-testid="armors">
      <Card.Header>
        <Badge bg="primary">Classe d&apos;armure</Badge>
      </Card.Header>
      <Card.Body className="position-relative small py-2">
        {texts.length > 0 && <span>Formations: {texts.join(", ")}</span>}
      </Card.Body>
      <Card.Body className="position-relative">
        <Row>
          {Object.entries(armorClasses).map(([key, { label, value }]) => (
            <ValueComponent key={key} label={label} className="col" value={value} />
          ))}
        </Row>
      </Card.Body>
      <Card.Body className="small">
        <span className="text-muted">Armure équipée :</span> aucune
      </Card.Body>
    </Card>
  );
}

function CardAttackBonuses({ character }: CharacterProps) {
  const attackBonuses = character.getAttackBonuses();
  return (
    <Card data-testid="attackBonuses">
      <Card.Header>
        <Badge bg="primary">Bonus d&apos;attaque</Badge>
      </Card.Header>
      <Card.Body className="position-relative">
        {!attackBonuses && (
          <div className="small">
            <em>Pas de classe sélectionnée</em>
          </div>
        )}
        {attackBonuses && (
          <Row>
            <ValueComponent label="Bonus de base à l'attaque" className="col-12 mb-2">
              <Badge bg={attackBonuses.base > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.base)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque au corps à corps" className="col">
              <Badge bg={attackBonuses.melee > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.melee)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque à distance" className="col">
              <Badge bg={attackBonuses.ranged > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.ranged)}
              </Badge>
            </ValueComponent>
            <ValueComponent label="Attaque de lancer" className="col">
              <Badge bg={attackBonuses.thrown > 0 ? "primary" : "secondary"} className="ms-1 mb-1">
                {displayBonus(attackBonuses.thrown)}
              </Badge>
            </ValueComponent>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

function CardWeapons({ data, character }: SheetProps) {
  const proficiencies = character.getWeaponProficiencies();
  const texts = proficiencies.map((p) => findOrError(data.weaponTypes, p).name);
  return (
    <Card data-testid="weapons">
      <Card.Header>
        <Badge bg="primary">Armes</Badge>
      </Card.Header>
      <Card.Body className="position-relative small py-2">
        {texts.length > 0 && <span>Formations: {texts.join(", ")}</span>}
      </Card.Body>
      <Card.Body className="position-relative">test</Card.Body>
    </Card>
  );
}

function CardAbilities({ character }: CharacterProps) {
  const modifiers = character.getModifiers().filter(ofType(ModifierTypes.ability));
  return (
    <Card data-testid="abilities">
      <Card.Header>
        <Badge bg="primary">Pouvoirs</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {modifiers.length === 0 && <em>Pas de pouvoir défini</em>}
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

function CardFeats({ character }: CharacterProps) {
  const feats = character.getFeats();
  return (
    <Card data-testid="sheet-feats">
      <Card.Header>
        <Badge bg="primary">Dons</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {feats.length === 0 && <em>Pas de don sélectionné</em>}
          {feats.map((feat) => (
            <div key={feat.target ? `${feat.id}-${feat.target}` : feat.id}>{feat.name}</div>
          ))}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function CardSpells({ character }: CharacterProps) {
  const spellsByLevel = character.getSelectedSpells();
  const isSpellCaster: boolean = character.getClass()?.spellCaster ?? false;
  const levels = [0, 1, 2, 3, 4, 5, 6];
  if (!isSpellCaster) {
    return null;
  }

  const spellsCount = Object.values(spellsByLevel).reduce((acc, level) => acc + level.length, 0);

  return (
    <Card data-testid="sheet-spells">
      <Card.Header>
        <Badge bg="primary">Sorts</Badge>
      </Card.Header>
      <Card.Body className="small">
        <Stack gap={2}>
          {spellsCount === 0 && <em>Pas de sort sélectionné</em>}
          {levels.map((level) => {
            const spells = spellsByLevel[level];
            if (spells !== undefined && spells.length > 0) {
              return (
                <>
                  <Badge className="bg-secondary me-auto">Niv. {level}</Badge>
                  {spells.map((spell) => (
                    <div key={spell.id}>{spell.name}</div>
                  ))}
                </>
              );
            }
          })}
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
          <CardAvatar character={character} />
          <CardDescription character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardAbilityScores data={data} character={character} />
          <CardInitiative character={character} />
          <CardSkills character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardKeyPoints character={character} />
          <CardSavingThrows data={data} character={character} />
          <CardArmorClass data={data} character={character} />
          <CardAttackBonuses character={character} />
          <CardWeapons data={data} character={character} />
        </Stack>
      </Col>
      <Col lg={3}>
        <Stack direction="vertical" gap={2}>
          <CardAbilities character={character} />
          <CardFeats character={character} />
          <CardSpells character={character} />
        </Stack>
      </Col>
    </Row>
  );
}
