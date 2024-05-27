"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers";
import Typeahead from "app/components/Typeahead";
import { World } from "model";

function useWorlds() {
  const [worlds, setWorlds] = useState<World[]>([]);
  useEffect(() => {
    fetch("/api/worlds")
      .then((response) => response.json())
      .then((data) => setWorlds(data));
  }, []);

  return worlds;
}

export function Profile() {
  const presenter = useCharacterPresenter();
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();
  const worlds = useWorlds();

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

  function handleHomeWorldChange(e: string): void {
    dispatch(mutators.updateHomeWorld(e));
  }

  function handleDeityChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(mutators.updateDeity(e.target.value));
  }

  return (
    <Stack direction="vertical" gap={2}>
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
          {data.alignments.map((alignment) => (
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
        onChange={handleHomeWorldChange}
        options={worlds}
      />

      <Form.FloatingLabel controlId="deity" label="Divinité">
        <Form.Control type="text" value={presenter.getDeity()} onChange={handleDeityChange} />
      </Form.FloatingLabel>
    </Stack>
  );
}
