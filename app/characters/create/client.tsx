"use client";

import dynamic from "next/dynamic";
import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Nav, Row, Stack } from "react-bootstrap";
import { Modifier, Trait, SecondaryTrait, AbilityScore, Class } from "../../types";
import { Character, ClientComponentData, Context } from "./types";
import ModifierComponent from "./ModifierComponent";

const LazyOperativeClassDetails = dynamic(() => import("./classes/operativeDetails"));
const LazyOperativeClassEditor = dynamic(() => import("./classes/operativeEditor"));

function ClassDetails({ classType, character, context }: { classType: Class; character: Character; context: Context }) {
  if (classType === null) {
    return null;
  }

  switch (classType.id) {
    case "class-operative":
      return <LazyOperativeClassDetails character={character} context={context} />;

    default:
      return null;
  }
}

function ClassEditor({
  classType,
  character,
  setCharacter,
}: {
  classType: Class;
  character: Character;
  setCharacter: Dispatch<SetStateAction<Character>>;
}) {
  if (classType === null) {
    return null;
  }

  switch (classType.id) {
    case "class-operative":
      return <LazyOperativeClassEditor character={character} setCharacter={setCharacter} />;

    default:
      return null;
  }
}

function findOrError<T>(array: T[], predicate: (value: T) => boolean): T {
  let result = array.find(predicate);
  if (result === undefined) {
    throw new Error("Can't find element in array");
  }
  return result;
}

export function ClientComponent({ data }: { data: ClientComponentData }) {
  const [context, setContext] = useState<Context>({});
  const [navigation, setNavigation] = useState("intro");
  const [character, setCharacter] = useState<Character>(new Character());

  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;
  const selectedClass = data.classes.find((c) => c.id === character.class) || null;

  const [alignment, setAlignment] = useState(data.alignments[0]);
  const [name, setName] = useState("");

  function getMinimalAbilityScoreFor(abilityScore: AbilityScore): number {
    let score = 10;

    if (selectedVariant) {
      score += selectedVariant.abilityScores[abilityScore.id] || 0;
    }

    if (selectedTheme) {
      score += selectedTheme.abilityScores[abilityScore.id] || 0;
    }

    if (
      character.raceVariant === "humans-standard" &&
      character.raceOptions !== undefined &&
      abilityScore.id === character.raceOptions.humanBonus
    ) {
      score += 2;
    }

    if (
      character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" &&
      character.themeOptions !== undefined &&
      abilityScore.id === character.themeOptions.noThemeAbility
    ) {
      score += 1;
    }

    return score;
  }

  function addToContext(name: string, value: string | number): void {
    setContext((c) => ({ ...c, [name]: value }));
  }

  function handleContext<T extends HTMLInputElement | HTMLSelectElement>(
    chain: ChangeEventHandler<T>
  ): ChangeEventHandler<T> {
    return (event: ChangeEvent<T>) => {
      let name = event.target.id;
      let value = event.target.value;
      addToContext(name, value);

      if (chain) {
        return chain(event);
      }
    };
  }

  function handleNavigation(eventKey: string | null): void {
    setNavigation(eventKey || "");
  }

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    let race = data.races.find((r) => r.id === id);
    if (race === undefined) {
      setCharacter({
        ...character,
        race: "",
        raceVariant: "",
        raceOptions: undefined,
        traits: [],
      });
    } else if (id === "humans") {
      setCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: { humanBonus: data.abilityScores[0].id },
        traits: race.traits.map((t) => t.id),
      });
    } else {
      setCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: undefined,
        traits: race.traits.map((t) => t.id),
      });
    }
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    if (id === "humans-standard") {
      setCharacter({ ...character, raceVariant: id, raceOptions: { humanBonus: data.abilityScores[0].id } });
    } else {
      setCharacter({ ...character, raceVariant: id, raceOptions: undefined });
    }
  }

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({ ...character, raceOptions: { humanBonus: id } });
  }

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    if (id === "74e471d9-db80-4fae-9610-44ea8eeedcb3") {
      // theme scholar
      setCharacter({
        ...character,
        theme: id,
        themeOptions: { scholarSkill: "life", scholarSpecialization: data.specials.scholar.life[0], scholarLabel: "" },
      });
      addToContext("scholarSkill", "life");
      addToContext("scholarSpecialization", data.specials.scholar.life[0]);
    } else if (id === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f") {
      // Sans thème
      setCharacter({
        ...character,
        theme: id,
        themeOptions: { noThemeAbility: "str" },
      });
    } else {
      // Autre thème
      setCharacter({ ...character, theme: id, themeOptions: undefined });
    }
  }

  function handleNoThemeSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        noThemeAbility: id,
      },
    });
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarSkill: id,
        scholarSpecialization: data.specials.scholar[id][0],
        scholarLabel: "",
      },
    });
    addToContext("scholarSpecialization", data.specials.scholar[id][0]);
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>): void {
    let specialization = e.target.value;
    setCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarSpecialization: specialization,
        scholarLabel: "",
      },
    });
    addToContext("scholarSpecialization", specialization);
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>): void {
    let label = e.target.value;
    setCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarLabel: label,
      },
    });
    addToContext("scholarSpecialization", label);
  }

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    if (id === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab") {
      setCharacter({ ...character, class: id, classOptions: { soldierAbilityScore: "str" } });
    } else {
      setCharacter({ ...character, class: id, classOptions: undefined });
    }
  }

  function handleSoldierAbilityScoreChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    setCharacter({ ...character, classOptions: { soldierAbilityScore: id } });
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value);
  }

  function handleRandomizeName(): void {
    if (selectedRace === null) {
      console.error("Can't provide a name without a race selected - control should be disabled");
      return;
    }

    let index = Math.floor(Math.random() * selectedRace.names.length);
    setName(selectedRace.names[index]);
  }

  function handleAlignmentChange(e: ChangeEvent<HTMLSelectElement>): void {
    let id = e.target.value;
    let alignment = data.alignments.find((a) => a.id === id);
    if (alignment === undefined) {
      console.error("Can't find alignment with id", id);
    } else {
      setAlignment(alignment);
    }
  }

  function findReplacedTrait(id: string): Trait | Modifier | null {
    if (!selectedRace) {
      return null;
    }

    let trait = selectedRace.traits.find((t) => t.id === id);
    if (trait) {
      return trait;
    }

    let modifier = selectedRace.traits
      .map((t) => t.modifiers)
      .flat()
      .find((c) => c !== undefined && c.id === id);
    if (modifier) {
      return modifier;
    }

    return null;
  }

  function handleTraitEnabled(trait: SecondaryTrait, e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.checked) {
      let updatedTraits = character.traits.filter((t) => trait.replace.findIndex((r) => r === t) === -1);
      setCharacter({ ...character, traits: [...updatedTraits, trait.id] });
    } else {
      setCharacter({ ...character, traits: character.traits.filter((t) => t !== trait.id).concat(trait.replace) });
    }
  }

  function handleAbilityScoreClick(ablityScoreId: string, delta: number): void {
    setCharacter({
      ...character,
      abilityScores: { ...character.abilityScores, [ablityScoreId]: character.abilityScores[ablityScoreId] + delta },
    });
  }

  return (
    <Row>
      <Col lg={12} className="mb-3">
        <Nav variant="underline" activeKey={navigation} onSelect={handleNavigation}>
          <Nav.Item>
            <Nav.Link eventKey="intro">Introduction</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="race">Race</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="theme" disabled={selectedRace === null}>
              Thème
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="class" disabled={selectedTheme === null}>
              Classe
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="abilityScores"
              disabled={selectedRace === null || selectedTheme === null || selectedClass === null}
            >
              Caractéristiques & Compétences
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="equipment" disabled={selectedRace === null}>
              Équipement
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="spells" disabled={selectedRace === null}>
              Sorts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="feats" disabled={selectedRace === null}>
              Don
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="debug">Debug</Nav.Link>
          </Nav.Item>
        </Nav>
      </Col>
      <Col lg={6} hidden={navigation !== "intro"}>
        <Stack direction="vertical" gap={2}>
          <h2>Introduction</h2>
          <p>
            Bienvenue dans le créateur de personnage pour le jeu de rôle <strong>StarFinder</strong> de Paizo
            Publishing.
          </p>
          <p>
            La version française se base sur la version publiée par Black Book Editions. Vous pouvez trouver plus
            d&apos;informations sur le jeu sur le site de l&apos;éditeur :{" "}
            <a href="https://www.black-book-editions.fr/catalogue.php?id=519">www.black-book-editions.fr</a>.
          </p>
        </Stack>
      </Col>
      <Col lg={3} hidden={navigation !== "race"}>
        <Stack direction="vertical" gap={2}>
          <h2>Race</h2>
          <Form.FloatingLabel controlId="race" label="Race">
            <Form.Select value={character.race} onChange={handleRaceChange}>
              {character.race === "" && <option value=""></option>}
              {data.races.map((race) => (
                <option key={race.id} value={race.id}>
                  {race.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          {selectedRace && (
            <>
              <Stack direction="horizontal">
                <Badge bg="primary">PV +{selectedRace.hitPoints}</Badge>
              </Stack>
              <p className="text-muted">{selectedRace.description}</p>
              {selectedRace.variants && selectedVariant && (
                <>
                  <Form.FloatingLabel controlId="variant" label="Variante">
                    <Form.Select value={character.raceVariant} onChange={handleVariantChange}>
                      {selectedRace.variants.map((variant, index) => (
                        <option key={index} value={variant.id}>
                          {variant.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.FloatingLabel>
                  {selectedVariant.id !== "humans-standard" && (
                    <Stack direction="horizontal">
                      {Object.entries(selectedVariant.abilityScores).map(([key, value]) => (
                        <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                          {findOrError(data.abilityScores, (a) => a.id === key).code} {value > 0 ? "+" : ""}
                          {value}
                        </Badge>
                      ))}
                    </Stack>
                  )}
                  {selectedVariant.id === "humans-standard" && character.raceOptions && (
                    <>
                      <Form.FloatingLabel controlId="humanBonus" label="Choix de la charactérisque">
                        <Form.Select value={character.raceOptions.humanBonus} onChange={handleHumanBonusChange}>
                          {data.abilityScores.map((abilityScore) => (
                            <option key={abilityScore.id} value={abilityScore.id}>
                              {abilityScore.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.FloatingLabel>
                      <Stack direction="horizontal">
                        <Badge bg="primary">
                          {findOrError(data.abilityScores, (a) => a.id === character.raceOptions.humanBonus).code}
                          {" +2"}
                        </Badge>
                      </Stack>
                    </>
                  )}
                  {selectedVariant.description && <p className="text-muted">{selectedVariant.description}</p>}
                </>
              )}
            </>
          )}

          {selectedRace && (
            <>
              <hr />
              <Card>
                <picture>
                  <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
                </picture>
              </Card>
            </>
          )}
        </Stack>
      </Col>

      <Col hidden={navigation !== "race"}>
        {selectedRace && (
          <Stack direction="vertical" gap={2}>
            <h2>Traits raciaux</h2>
            {selectedRace.traits.map((trait) => (
              <Card
                key={trait.id}
                className={
                  character.traits.find((t) => t === trait.id) !== undefined ? "" : "text-decoration-line-through"
                }
              >
                <Card.Header>{trait.name}</Card.Header>
                <Card.Body>
                  {trait.description && <p className="text-muted">{trait.description}</p>}
                  {trait.modifiers &&
                    trait.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
                </Card.Body>
              </Card>
            ))}
          </Stack>
        )}
      </Col>

      <Col hidden={navigation !== "race"}>
        {selectedRace && (
          <Stack direction="vertical" gap={2}>
            <h2>Traits alternatifs</h2>
            {selectedRace.secondaryTraits &&
              selectedRace.secondaryTraits.map((trait) => (
                <Card key={trait.id}>
                  <Card.Header>
                    <Form.Switch
                      label={trait.name}
                      checked={character.traits.find((t) => t === trait.id) !== undefined}
                      onChange={(e) => handleTraitEnabled(trait, e)}
                      disabled={
                        character.traits.find((t) => t === trait.id) === undefined &&
                        trait.replace.some((r) => character.traits.find((t) => t === r) === undefined)
                      }
                    />
                  </Card.Header>
                  <Card.Body>
                    <div key={trait.id}>
                      <div>
                        <span>Remplace : </span>
                        {trait.replace.map((r) => findReplacedTrait(r)?.name).join(", ")}
                      </div>
                      <p className="text-muted">{trait.description}</p>
                      {trait.modifiers &&
                        trait.modifiers.map((modifier) => <ModifierComponent key={modifier.id} modifier={modifier} />)}
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </Stack>
        )}
      </Col>

      <Col lg={3} hidden={navigation !== "theme"}>
        <Stack direction="vertical" gap={2}>
          <h2>Thème</h2>
          <Form.FloatingLabel controlId="theme" label="Thème">
            <Form.Select value={character.theme} onChange={handleThemeChange}>
              {character.theme === "" && <option value=""></option>}
              {data.themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          {selectedTheme && character.theme !== "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" && (
            <Stack direction="horizontal">
              {Object.entries(selectedTheme.abilityScores).map(([key, value]) => (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {findOrError(data.abilityScores, (a) => a.id === key).code} {value > 0 ? "+" : ""}
                  {value}
                </Badge>
              ))}
            </Stack>
          )}
          {selectedTheme && <p className="text-muted">{selectedTheme.description}</p>}
          {character.theme === "e1a9a6ad-0c95-4f31-a692-3327c77bb53f" && character.themeOptions && (
            <>
              <Form.FloatingLabel controlId="noThemeAbility" label="Choix de la charactérisque">
                <Form.Select value={character.themeOptions.noThemeAbility} onChange={handleNoThemeSkillChange}>
                  {data.abilityScores.map((abilityScore) => (
                    <option key={abilityScore.id} value={abilityScore.id}>
                      {abilityScore.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.FloatingLabel>
              <Stack direction="horizontal">
                <Badge bg={"primary"}>
                  {findOrError(data.abilityScores, (a) => a.id === character.themeOptions.noThemeAbility).code}
                  {" +1"}
                </Badge>
              </Stack>
            </>
          )}
          {character.theme === "74e471d9-db80-4fae-9610-44ea8eeedcb3" && character.themeOptions && (
            <>
              <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
                <Form.Select
                  value={character.themeOptions.scholarSkill}
                  onChange={handleContext(handleScholarSkillChange)}
                >
                  {data.skills
                    .filter((s) => s.id === "life" || s.id === "phys")
                    .map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.FloatingLabel>
              <Form.FloatingLabel controlId="scholarSpecialization" label="Choix de la spécialité">
                <Form.Select
                  value={character.themeOptions.scholarSpecialization}
                  onChange={handleScholarSpecializationChange}
                >
                  {data.specials.scholar[character.themeOptions.scholarSkill].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="">Autre domaine</option>
                </Form.Select>
              </Form.FloatingLabel>
              <Form.FloatingLabel
                controlId="scholarLabel"
                label="Domaine de spécialité"
                hidden={character.themeOptions.scholarSpecialization !== ""}
              >
                <Form.Control
                  type="text"
                  value={character.themeOptions.scholarLabel}
                  onChange={handleScholarLabelChange}
                />
              </Form.FloatingLabel>
            </>
          )}
        </Stack>
      </Col>

      <Col hidden={navigation !== "theme"}>
        <Stack direction="vertical" gap={2}>
          <h2>Traits thématiques</h2>
          {selectedTheme &&
            selectedTheme.features.map((feature) => (
              <Card key={feature.id}>
                <Card.Header>
                  <Badge bg="secondary">niveau {feature.level}</Badge>
                  {feature.name}
                </Card.Header>
                <Card.Body>
                  {feature.description && <p className="text-muted">{feature.description}</p>}
                  {feature.modifiers &&
                    feature.modifiers.map((modifier) => (
                      <ModifierComponent key={modifier.id} modifier={modifier} context={context} />
                    ))}
                </Card.Body>
              </Card>
            ))}
        </Stack>
      </Col>

      <Col lg={3} hidden={navigation !== "class"}>
        <Stack direction="vertical" gap={2}>
          <h2>Classe</h2>
          <Form.FloatingLabel controlId="class" label="Classe">
            <Form.Select value={character.class} onChange={handleClassChange}>
              {character.class === "" && <option value=""></option>}
              {data.classes.map((classType) => (
                <option key={classType.id} value={classType.id}>
                  {classType.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
          {selectedClass && (
            <>
              <Stack direction="horizontal">
                {!Array.isArray(selectedClass.keyAbilityScore) && (
                  <Badge bg="primary">
                    {findOrError(data.abilityScores, (a) => a.id === selectedClass.keyAbilityScore).code}
                  </Badge>
                )}
                <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
                <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
              </Stack>
              <p className="text-muted">{selectedClass.description}</p>
            </>
          )}
          {selectedClass && selectedClass.id === "7d165a8f-d874-4d09-88ff-9f2ccd77a3ab" && character.classOptions && (
            <>
              <Form.FloatingLabel controlId="soldierAbilityScore" label="Caractérisque de classe">
                <Form.Select
                  value={character.classOptions.soldierAbilityScore}
                  onChange={handleSoldierAbilityScoreChange}
                >
                  <option value="str">{findOrError(data.abilityScores, (a) => a.id === "str").name}</option>
                  <option value="dex">{findOrError(data.abilityScores, (a) => a.id === "dex").name}</option>
                </Form.Select>
              </Form.FloatingLabel>
              <Stack direction="horizontal">
                <Badge bg="primary">
                  {findOrError(data.abilityScores, (a) => a.id === character.classOptions.soldierAbilityScore).code}
                </Badge>
              </Stack>
            </>
          )}
          {selectedClass && (
            <>
              <hr />
              <div>
                <Badge bg="primary">Rang de compétence</Badge>+{selectedClass.skillRank}
              </div>
              <div>
                <Badge bg="primary">Armures</Badge>
                {selectedClass.armors.map((a) => data.armors[a]).join(", ")}
              </div>
              <div>
                <Badge bg="primary">Armes</Badge>
                {selectedClass.weapons.map((a) => data.weapons[a]).join(", ")}
              </div>
              <hr />
              <ClassEditor classType={selectedClass} character={character} setCharacter={setCharacter} />
            </>
          )}
        </Stack>
      </Col>

      <Col hidden={navigation !== "class"}>
        {selectedClass && <ClassDetails classType={selectedClass} character={character} context={context} />}
      </Col>

      <Col lg={4} hidden={navigation !== "abilityScores"}>
        <Stack direction="vertical" gap={2}>
          <h2>Caractéristiques</h2>
          <Form.FloatingLabel controlId="abilityScoresMethod" label="Méthode de génération">
            <Form.Select>
              <option value="buy">Achat (méthode conseillée)</option>
              <option value="quick" disabled>
                Déterminaton rapide
              </option>
              <option value="random" disabled>
                Déterminaton aléatoire
              </option>
            </Form.Select>
          </Form.FloatingLabel>
          {data.abilityScores.map((abilityScore) => {
            let minimalScore = getMinimalAbilityScoreFor(abilityScore);
            let delta = minimalScore - 10;
            return (
              <Form.Group key={abilityScore.id} as={Row} controlId={abilityScore.id}>
                <Form.Label column>
                  {abilityScore.name}
                  {delta < 0 && <span className="badge ms-3 bg-secondary">{delta}</span>}
                  {delta > 0 && <span className="badge ms-3 bg-primary">+{delta}</span>}
                </Form.Label>
                <Col lg={4}>
                  <InputGroup>
                    <Button
                      variant="outline-secondary"
                      disabled={character.abilityScores[abilityScore.id] <= minimalScore}
                      onClick={() => handleAbilityScoreClick(abilityScore.id, -1)}
                    >
                      <i className="bi-dash-lg"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      className="text-center"
                      value={character.abilityScores[abilityScore.id] || minimalScore}
                      onChange={() => {}}
                      min={minimalScore}
                      max={4}
                    />
                    <Button
                      variant="outline-secondary"
                      disabled={character.abilityScores[abilityScore.id] >= 18}
                      onClick={() => handleAbilityScoreClick(abilityScore.id, 1)}
                    >
                      <i className="bi-plus-lg"></i>
                    </Button>
                  </InputGroup>
                </Col>
                <Col lg={2}>
                  <div className="border rounded h-100 border-primary text-center">+2</div>
                </Col>
              </Form.Group>
            );
          })}
        </Stack>
      </Col>

      <Col lg={12} hidden={navigation !== "debug"}>
        <pre>{JSON.stringify(character, null, 2)}</pre>
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </Col>
    </Row>
  );
}
