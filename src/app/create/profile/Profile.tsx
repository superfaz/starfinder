"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import { computeSteps, mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers-client";
import Typeahead from "app/components/Typeahead";
import { Deity, INamedModel, World } from "model";
import { Alert } from "react-bootstrap";

function useWorlds() {
  const [worlds, setWorlds] = useState<World[]>([]);
  useEffect(() => {
    fetch("/api/worlds")
      .then((response) => response.json())
      .then((data) => setWorlds(data));
  }, []);

  return worlds;
}

function useDeities() {
  const [deities, setDeities] = useState<Deity[]>([]);
  useEffect(() => {
    fetch("/api/deities")
      .then((response) => response.json())
      .then((data) => setDeities(data));
  }, []);

  return deities;
}

function useLanguages() {
  const [data, setData] = useState<INamedModel[]>([]);
  useEffect(() => {
    fetch("/api/languages")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return data;
}

function DeityLine({ deity }: Readonly<{ deity: Deity }>) {
  const alignments = useAppSelector((state) => state.data.alignments);
  return (
    <div className="d-flex justify-content-between">
      <div>{deity.name}</div>
      <div className="">{alignments.find((a) => a.id === deity.alignment)?.code}</div>
    </div>
  );
}

export function Profile() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();
  const alignments = useAppSelector((state) => state.data.alignments);
  const worlds = useWorlds();
  const deities = useDeities();
  const languages = useLanguages();

  if (presenter.getClass() === null) {
    return null;
  }

  const selectedHomeWorld = worlds.find((world) => world.name === presenter.getHomeWorld());
  const selectedDeity = deities.find((deity) => deity.name === presenter.getDeity());
  const steps = computeSteps(
    alignments.find((a) => a.id === presenter.getAlignment()),
    alignments.find((a) => a.id === selectedDeity?.alignment)
  );

  function languageForWorld(world: string): string {
    const selectedWorld = worlds.find((w) => w.name === world);
    return selectedWorld?.language ?? "";
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(mutators.updateName(e.target.value));
  }

  function handleRandomNameClick(): void {
    const selectedRace = presenter.getRace();
    if (!selectedRace) {
      return;
    }

    const names = selectedRace.names;
    const name = names[Math.floor(Math.random() * names.length)];
    dispatch(mutators.updateName(name));
  }

  function handleAlignmentChange(e: ChangeEvent<HTMLSelectElement>): void {
    dispatch(mutators.updateAlignment(e.target.value));
  }

  function handleSexChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(mutators.updateSex(e.target.value));
  }

  function handleHomeWorldChange(world: string, language: string): void {
    dispatch(mutators.updateHomeWorld({ world, language }));
  }

  function handleDeityChange(e: string): void {
    dispatch(mutators.updateDeity(e));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Profil</h2>
      <InputGroup>
        <Form.FloatingLabel controlId="character-name" label="Nom du personnage">
          <Form.Control type="text" autoComplete="off" value={presenter.getName()} onChange={handleNameChange} />
        </Form.FloatingLabel>
        <Button variant="outline-secondary" onClick={handleRandomNameClick}>
          <i className="bi bi-shuffle"></i>
        </Button>
      </InputGroup>

      <Form.FloatingLabel controlId="alignment" label="Alignement">
        <Form.Select value={presenter.getAlignment()} onChange={handleAlignmentChange}>
          {presenter.getAlignment() === "" && <option value=""></option>}
          {alignments.map((alignment) => (
            <option key={alignment.id} value={alignment.id}>
              {`${alignment.name} (${alignment.code})`}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>

      <Form.FloatingLabel controlId="sex" label="Sexe">
        <Form.Control type="text" value={presenter.getSex()} onChange={handleSexChange} />
      </Form.FloatingLabel>

      <Typeahead
        controlId="homeWorld"
        label="Monde natal"
        value={presenter.getHomeWorld()}
        onChange={(w) => handleHomeWorldChange(w, languageForWorld(w))}
        disabled={worlds.length === 0}
        options={worlds}
      />

      {selectedHomeWorld?.language && (
        <div className="text-muted">
          <div>Langue standard : {languages.find((a) => a.id === selectedHomeWorld.language)?.name}</div>
        </div>
      )}

      <Typeahead
        controlId="deity"
        label="Divinité"
        value={presenter.getDeity()}
        onChange={handleDeityChange}
        disabled={deities.length === 0}
        options={deities}
        renderItem={(item) => <DeityLine deity={item} />}
      />

      {selectedDeity && (
        <div className="text-muted">
          <div>Alignement : {alignments.find((a) => a.id === selectedDeity.alignment)?.name}</div>
          <div>Domaines : {selectedDeity.portfolios}</div>
        </div>
      )}
      {steps > 1 && (
        <Alert variant="warning">
          <strong>Attention : </strong> Votre alignement et celui de votre divinité sont séparés de plus de 1 catégorie.
        </Alert>
      )}
    </Stack>
  );
}
