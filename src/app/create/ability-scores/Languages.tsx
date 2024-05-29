import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import Typeahead from "app/components/Typeahead";
import { useEffect, useState } from "react";
import { INamedModel } from "model";
import { InputGroup } from "app/components";
import { mutators, useAppDispatch } from "logic";

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

  if (languages.length === 0) {
    return null;
  }

  const raceLanguage =
    languages.find((l) => l.id === presenter.getRace()?.language)?.name ?? presenter.getRace()?.language;
  const homeWorldLanguage =
    languages.find((l) => l.id === presenter.getHomeWorldLanguage())?.name ?? presenter.getHomeWorldLanguage();

  function handleHomeWorldLanguageChange(language: string): void {
    const id = languages.find((l) => l.name === language)?.id;
    dispatch(mutators.updateHomeWorldLanguage(id ?? language));
  }

  return (
    <Stack direction="vertical" gap={2}>
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
    </Stack>
  );
}
