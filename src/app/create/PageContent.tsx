"use client";

import { mutators, useAppDispatch } from "logic";
import { ChangeEvent } from "react";
import { Button, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../edit/[character]/helpers-client";
import { RaceSelection } from "../edit/[character]/race/RaceSelection";
import { ThemeSelection } from "../edit/[character]/theme/ThemeSelection";
import { ClassSelection } from "../edit/[character]/class/ClassSelection";

export function PageContent() {
  const presenter = useCharacterPresenter();
  const dispatch = useAppDispatch();

  function handleNameChange(e: ChangeEvent<HTMLInputElement>): void {
    dispatch(mutators.updateName(e.target.value));
  }

  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    dispatch(mutators.updateDescription(e.target.value));
  }

  return (
    <>
      <Col md={6}>
        <Stack direction="vertical" gap={2}>
          <div className="lead mt-3">Quel genre de héros de science-fantasy voulez-vous jouer ?</div>
          <Form.FloatingLabel controlId="character-desc" label="Concept">
            <Form.Control
              as="textarea"
              aria-label="Concept"
              value={presenter.getDescription()}
              onChange={handleDescriptionChange}
              style={{ height: "20em" }}
            />
          </Form.FloatingLabel>

          <div className="lead mt-3">Quel est le nom de votre nouvel héros ?</div>
          <Form.FloatingLabel controlId="character-name" label="Nom du personnage">
            <Form.Control type="text" autoComplete="off" value={presenter.getName()} onChange={handleNameChange} />
          </Form.FloatingLabel>
        </Stack>
      </Col>
      <Col md={6} className="mt-2">
        <Stack direction="vertical" gap={2}>
          <div className="lead mt-3">Quelle sera sa race ?</div>
          <RaceSelection mode="light" />

          <div className="lead">Quel sera son thème ?</div>
          <ThemeSelection mode="light" />

          <div className="lead">Quelle sera sa classe ?</div>
          <ClassSelection mode="light" />
        </Stack>
      </Col>
      <Col md={6} lg={4} className="offset-md-3 offset-lg-8 mt-2">
        <Stack direction="vertical" gap={2}>
          <Button variant="primary" className="my-4" disabled={!presenter.getClass()}>
            Démarrer la création détaillée
          </Button>
        </Stack>
      </Col>
    </>
  );
}
