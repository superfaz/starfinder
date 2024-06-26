"use client";

import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { InputGroup } from "app/components";
import Typeahead from "app/components/Typeahead";
import { mutators, useAppDispatch } from "logic";
import { INamedModel } from "model";
import { useCharacterPresenter } from "../helpers";
import { idOrName } from "app/helpers";

function useLanguages() {
  const [languages, setLanguages] = useState<INamedModel[]>([]);
  useEffect(() => {
    fetch("/api/languages")
      .then((response) => response.json())
      .then(setLanguages);
  }, []);

  return languages;
}

function Language({
  controlId,
  languages,
  label,
  value,
  onChange,
  disabled = false,
}: Readonly<{
  controlId: string;
  languages: INamedModel[];
  label: string;
  value?: string;
  onChange?: (newValue: string) => void;
  disabled?: boolean;
}>) {
  return (
    <InputGroup>
      {disabled && (
        <>
          <Form.FloatingLabel style={{ width: "70%" }} controlId={controlId} label={label}>
            <Form.Control type="text" value={value} disabled />
          </Form.FloatingLabel>
        </>
      )}
      {!disabled && (
        <Typeahead
          controlId={controlId}
          label={label}
          value={value ?? ""}
          options={languages}
          onChange={onChange ?? (() => {})}
          style={{ width: "70%" }}
        />
      )}
      <Form.FloatingLabel style={{ width: "30%" }} controlId={`${controlId}Format`} label="Format">
        <Form.Select>
          <option>Normal</option>
          <option>Signé</option>
          <option>Tactile</option>
        </Form.Select>
      </Form.FloatingLabel>
    </InputGroup>
  );
}

export default function Languages() {
  const presenter = useCharacterPresenter();
  const languages = useLanguages();
  const dispatch = useAppDispatch();

  if (presenter.getClass() === null) {
    return null;
  }

  if (languages.length === 0) {
    return null;
  }

  const raceLanguage = idOrName(languages, presenter.getRace()?.language);
  const homeWorldLanguage = idOrName(languages, presenter.getHomeWorldLanguage());
  const extraLanguagesCount = presenter.getExtraLanguagesCount();
  const selectedLanguages = presenter.getLanguages();
  const remaining = extraLanguagesCount - selectedLanguages.length;

  function handleHomeWorldLanguageChange(language: string): void {
    const id = languages.find((l) => l.name === language)?.id;
    dispatch(mutators.updateHomeWorldLanguage(id ?? language));
  }

  function handleAddLanguage(): void {
    dispatch(mutators.addLanguage(""));
  }

  function handleRemoveLanguage(index: number): void {
    dispatch(mutators.removeLanguage(index));
  }

  function handleSetLanguage(index: number, language: string): void {
    const id = languages.find((l) => l.name === language)?.id;
    dispatch(mutators.updateLanguage({ index, language: id ?? language }));
  }

  return (
    <Stack direction="vertical" gap={2} className="mt-xl-3 mb-3" data-testid="languages">
      <h2>Langues</h2>
      <Language controlId="languageCommon" languages={languages} label="Langue principale" value="Commun" disabled />
      {raceLanguage && (
        <Language controlId="languageRace" languages={languages} label="Langue raciale" value={raceLanguage} disabled />
      )}
      <Language
        controlId="languageHomeWorld"
        languages={languages}
        label="Langue du monde d'origine"
        value={homeWorldLanguage}
        onChange={handleHomeWorldLanguageChange}
      />

      {(extraLanguagesCount > 0 || selectedLanguages.length > 0) && (
        <Row>
          <Col xs="auto">
            <Button
              onClick={handleAddLanguage}
              disabled={remaining <= 0}
              variant={remaining <= 0 ? "secondary" : "primary"}
            >
              Ajouter
            </Button>
          </Col>
          <Col xs={2}>
            <Form.Control className="text-center" type="number" value={remaining} disabled />
          </Col>
          <Col>
            <Form.Label className="text-center text-muted mt-2">Langues additionnelles</Form.Label>
          </Col>
        </Row>
      )}

      {selectedLanguages.map((language, index) => (
        <Stack key={index} direction="horizontal" gap={2}>
          <Language
            controlId={`language${index}`}
            languages={languages}
            label="Langue additionnelle"
            value={idOrName(languages, language)}
            onChange={(v) => handleSetLanguage(index, v)}
          />
          <Button variant="outline-danger" onClick={() => handleRemoveLanguage(index)}>
            <span className="visually-hidden">Supprimer</span>
            <span aria-hidden="true">&times;</span>
          </Button>
        </Stack>
      ))}
    </Stack>
  );
}
