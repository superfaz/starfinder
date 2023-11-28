"use client";

import { ChangeEvent, useState } from "react";
import { Badge, Button, Card, Col, Form, InputGroup, Nav, Row, Stack } from "react-bootstrap";
import { Component, Trait, SecondaryTrait, AbilityScore } from "../../types";
import { Character, ClientComponentData } from "./types";

function Component({ component }: { component: Component }) {
  switch (component.type) {
    case "ability":
      return (
        <p>
          <Badge bg="primary">Pouvoir</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "hitPoints":
      return (
        <p>
          <Badge bg="primary">Points de vie</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    case "savingThrow":
      return (
        <p>
          <Badge bg="primary">Jets de sauvegarde</Badge>
          {component.name && <strong className="me-1">{component.name}.</strong>}
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skill":
      return (
        <p>
          <Badge bg="primary">Compétence</Badge>
          <strong>
            {component.target} {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
          <span className="ms-1 text-muted">{component.description}</span>
        </p>
      );
    case "classSkill":
      return (
        <p>
          <Badge bg="primary">Compétence de classe</Badge>
          <strong>{component.target}</strong>
        </p>
      );
    case "featCount":
      return (
        <p>
          <Badge bg="primary">Nombre de Dons</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    case "feat":
      return (
        <p>
          <Badge bg="primary">Don</Badge>
          {component.level && component.level > 1 && <Badge bg="primary">Niveau {component.level}</Badge>}
          <strong className="me-1">{component.name}.</strong>
          <span className="text-muted">{component.description}</span>
        </p>
      );
    case "skillRank":
      return (
        <p>
          <Badge bg="primary">Rang de compétence</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
          <span className="ms-1 text-muted">{component.description}</span>
        </p>
      );
    case "spell":
      return (
        <p>
          <Badge bg="primary">Sort</Badge>
          <strong>{component.name}</strong>
          {component.description && <span className="ms-1 text-muted">{component.description}</span>}
        </p>
      );
    case "languageCount":
      return (
        <p>
          <Badge bg="primary">Nombre de langue</Badge>
          <strong>
            {component.value > 0 ? "+" : ""}
            {component.value}
          </strong>
        </p>
      );
    default:
      return null;
  }
}

export function ClientComponent({ data }: { data: ClientComponentData }) {
  const [navigation, updateNavigation] = useState("profil");
  const [character, updateCharacter] = useState<Character>({
    race: "",
    raceVariant: "",
    theme: "",
    class: "",
    traits: [],
    abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  });

  const selectedRace = data.races.find((r) => r.id === character.race) || null;
  const selectedVariant = selectedRace?.variants.find((v) => v.id === character.raceVariant) || null;
  const selectedTheme = data.themes.find((r) => r.id === character.theme) || null;
  const selectedClass = data.classes.find((c) => c.id === character.class) || null;

  const [alignment, updateAlignment] = useState(data.alignments[0]);
  const [name, updateName] = useState("");

  function getMinimalAbilityScoreFor(character: Character, abilityScore: AbilityScore): number {
    let score = 10;

    if (selectedVariant) {
      score += selectedVariant.abilityScores[abilityScore.id] || 0;
    }

    if (selectedTheme) {
      score += selectedTheme.abilityScores[abilityScore.id] || 0;
    }

    return score;
  }

  function handleNavigation(key: string) {
    updateNavigation(key);
  }

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let race = data.races.find((r) => r.id === id);
    if (id === "humans") {
      updateCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: { humanBonus: data.abilityScores[0].id },
        traits: race.traits.map((t) => t.id),
      });
    } else {
      updateCharacter({
        ...character,
        race: id,
        raceVariant: race.variants[0].id,
        raceOptions: null,
        traits: race.traits.map((t) => t.id),
      });
    }
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let variant = selectedRace.variants.find((o) => o.id === id);

    if (selectedRace.id === "humans" && variant.id === "standard") {
      updateCharacter({ ...character, raceVariant: id, raceOptions: { humanBonus: data.abilityScores[0].id } });
    } else {
      updateCharacter({ ...character, raceVariant: id, raceOptions: null });
    }
  }

  function handleHumanBonusChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    updateCharacter({ ...character, raceOptions: { humanBonus: id } });
  }

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    if (id === "74e471d9-db80-4fae-9610-44ea8eeedcb3") {
      // theme scholar
      updateCharacter({
        ...character,
        theme: id,
        themeOptions: { scholarSkill: "life", scholarSpecialization: data.specials.scholar.life[0], scholarLabel: "" },
      });
    } else {
      updateCharacter({ ...character, theme: id, themeOptions: null });
    }
  }

  function handleScholarSkillChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    updateCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarSkill: id,
        scholarSpecialization: data.specials.scholar[id][0],
        scholarLabel: "",
      },
    });
  }

  function handleScholarSpecializationChange(e: ChangeEvent<HTMLSelectElement>) {
    let specialization = e.target.value;
    updateCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarSpecialization: specialization,
        scholarLabel: "",
      },
    });
  }

  function handleScholarLabelChange(e: ChangeEvent<HTMLInputElement>) {
    let label = e.target.value;
    updateCharacter({
      ...character,
      themeOptions: {
        ...character.themeOptions,
        scholarLabel: label,
      },
    });
  }

  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    updateCharacter({ ...character, class: id });
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    updateName(e.target.value);
  }

  function handleRandomizeName() {
    let index = Math.floor(Math.random() * selectedRace.names.length);
    updateName(selectedRace.names[index]);
  }

  function handleAlignmentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let id = e.target.value;
    let alignment = data.alignments.find((a) => a.id === id);
    updateAlignment(alignment);
  }

  function findReplacedTrait(id: string): Trait | Component {
    let trait = selectedRace.traits.find((t) => t.id === id);
    if (trait) {
      return trait;
    }

    let component = selectedRace.traits
      .map((t) => t.components)
      .flat()
      .find((c) => c.id === id);
    if (component) {
      return component;
    }

    return null;
  }

  function handleTraitEnabled(trait: SecondaryTrait, e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      let updatedTraits = character.traits.filter((t) => trait.replace.findIndex((r) => r === t) === -1);
      updateCharacter({ ...character, traits: [...updatedTraits, trait.id] });
    } else {
      updateCharacter({ ...character, traits: character.traits.filter((t) => t !== trait.id).concat(trait.replace) });
    }
  }

  return (
    <Row>
      <Col lg={12}>
        <Nav variant="underline" activeKey={navigation} onSelect={handleNavigation}>
          <Nav.Item>
            <Nav.Link eventKey="profil">Profil</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="traits" disabled={selectedRace === null}>
              Traits
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="abilityScores"
              disabled={selectedRace === null || selectedTheme === null || selectedClass === null}
            >
              Caractéristiques
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="skills"
              disabled={selectedRace === null || selectedTheme === null || selectedClass === null}
            >
              Compétences
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
      <Col hidden={navigation !== "profil"}>
        <Stack direction="vertical" gap={2}>
          <h2>Profil</h2>
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
              {selectedRace.variants && (
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
                  {(selectedRace.id !== "humans" || selectedVariant.id !== "standard") && (
                    <Stack direction="horizontal">
                      {Object.entries(selectedVariant.abilityScores).map(([key, value]) => (
                        <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                          {data.abilityScores.find((a) => a.id === key).code} {value > 0 ? "+" : ""}
                          {value}
                        </Badge>
                      ))}
                    </Stack>
                  )}
                  {selectedRace.id === "humans" && selectedVariant.id === "standard" && (
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
                          {data.abilityScores.find((a) => a.id === character.raceOptions.humanBonus).code} +2
                        </Badge>
                      </Stack>
                    </>
                  )}
                  {selectedVariant.description && <p className="text-muted">{selectedVariant.description}</p>}
                </>
              )}
            </>
          )}

          <hr />

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
          {selectedTheme && (
            <Stack direction="horizontal">
              {Object.entries(selectedTheme.abilityScores).map(([key, value]) => (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {data.abilityScores.find((a) => a.id === key).code} {value > 0 ? "+" : ""}
                  {value}
                </Badge>
              ))}
            </Stack>
          )}
          {character.theme === "74e471d9-db80-4fae-9610-44ea8eeedcb3" && (
            <>
              <Form.FloatingLabel controlId="scholarSkill" label="Choix de la compétence de classe">
                <Form.Select value={character.themeOptions.scholarSkill} onChange={handleScholarSkillChange}>
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
          {selectedTheme && <p className="text-muted">{selectedTheme.description}</p>}

          <hr />

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
                <Badge bg="primary">{selectedClass.keyAbilityScore}</Badge>
                <Badge bg="primary">EN +{selectedClass.staminaPoints}</Badge>
                <Badge bg="primary">PV +{selectedClass.hitPoints}</Badge>
              </Stack>
              <p className="text-muted">{selectedClass.description}</p>
            </>
          )}
        </Stack>
      </Col>
      <Col hidden={navigation !== "profil"}>
        <Stack direction="vertical" gap={2}>
          <h2>Concept</h2>
          <InputGroup>
            <Form.FloatingLabel controlId="name" label="Nom du personnage">
              <Form.Control type="text" value={name} onChange={handleNameChange} />
            </Form.FloatingLabel>
            <Button variant="outline-secondary" onClick={handleRandomizeName} disabled={selectedRace === null}>
              <i className="bi-shuffle"></i>
            </Button>
          </InputGroup>
          <Form.FloatingLabel controlId="name" label="Sexe">
            <Form.Control type="text" />
          </Form.FloatingLabel>
          {selectedRace && (
            <Card>
              <picture>
                <img alt="" src={"/" + selectedRace.id + "-male.png"} className="img-fluid" />
              </picture>
            </Card>
          )}
          <Form.FloatingLabel controlId="alignment" label="Alignement">
            <Form.Select value={alignment.id} onChange={handleAlignmentChange}>
              {data.alignments.map((alignment) => (
                <option key={alignment.id} value={alignment.id}>
                  {alignment.name}
                </option>
              ))}
            </Form.Select>
          </Form.FloatingLabel>
        </Stack>
      </Col>
      <Col lg={6} hidden={navigation !== "profil"}>
        <Stack direction="vertical" gap={2}>
          <h2>Traits du personnage</h2>
          {!selectedRace && (
            <p>
              <em>Sélectionner une race</em>
            </p>
          )}
          {selectedRace && (
            <>
              {selectedRace.traits
                .concat(selectedRace.secondaryTraits)
                .filter((trait) => character.traits.findIndex((v) => v === trait.id) !== -1)
                .map((trait) => (
                  <div key={trait.id}>
                    <h5>{trait.name}</h5>
                    <p className="text-muted">{trait.description}</p>
                    {trait.components &&
                      trait.components.map((component) => <Component key={component.id} component={component} />)}
                  </div>
                ))}
            </>
          )}

          <hr />

          {selectedTheme &&
            selectedTheme.advantages
              .filter((a) => a.level === 1)
              .map((advantage) => (
                <div key={advantage.id}>
                  <h5>{advantage.name}</h5>
                  <p className="text-muted">{advantage.description}</p>
                  {advantage.components &&
                    advantage.components.map((component) => <Component key={component.id} component={component} />)}
                </div>
              ))}
        </Stack>
      </Col>

      <Col lg={6} hidden={navigation !== "traits"}>
        {selectedRace && (
          <Stack direction="vertical" gap={2}>
            <h2>Traits raciaux</h2>
            {selectedRace.traits.map((trait) => (
              <div
                key={trait.id}
                className={
                  character.traits.find((t) => t === trait.id) !== undefined ? "" : "text-decoration-line-through"
                }
              >
                <h5>{trait.name}</h5>
                <p className="text-muted">{trait.description}</p>
                {trait.components &&
                  trait.components.map((component) => <Component key={component.id} component={component} />)}
              </div>
            ))}
          </Stack>
        )}
      </Col>

      <Col lg={6} hidden={navigation !== "traits"}>
        {selectedRace && (
          <Stack direction="vertical" gap={2}>
            <h2>Traits alternatifs</h2>
            {selectedRace.secondaryTraits &&
              selectedRace.secondaryTraits.map((trait) => (
                <div key={trait.id}>
                  <h5>
                    <Form.Switch
                      label={trait.name}
                      checked={character.traits.find((t) => t === trait.id) !== undefined}
                      onChange={(e) => handleTraitEnabled(trait, e)}
                      disabled={
                        character.traits.find((t) => t === trait.id) === undefined &&
                        trait.replace.some((r) => character.traits.find((t) => t === r) === undefined)
                      }
                    />
                  </h5>
                  <div>
                    <span>Remplace : </span>
                    {trait.replace.map((r) => findReplacedTrait(r)?.name).join(", ")}
                  </div>
                  <p className="text-muted">{trait.description}</p>
                  {trait.components &&
                    trait.components.map((component) => <Component key={component.id} component={component} />)}
                </div>
              ))}
          </Stack>
        )}
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
            let minimalScore = getMinimalAbilityScoreFor(character, abilityScore);
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
                    >
                      <i className="bi-dash-lg"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      className="text-center"
                      value={character.abilityScores[abilityScore.id] || minimalScore}
                      min={minimalScore}
                      max={4}
                    />
                    <Button variant="outline-secondary" disabled={character.abilityScores[abilityScore.id] >= 18}>
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
      </Col>
    </Row>
  );
}
