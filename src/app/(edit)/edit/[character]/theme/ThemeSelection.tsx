"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { ActionErrors } from "app/helpers-server";
import { displayBonus, findOrError } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { IdSchema, Theme } from "model";
import { Badge } from "ui";
import { ReferenceComponent } from "../ReferenceComponent";
import { UpdateState, updateTheme, UpdateThemeInput } from "./actions";
import ThemelessLoading from "./ThemelessLoading";
import ThemeScholarLoading from "./ThemeScholarLoading";

const LazyThemeIconEditor = dynamic(() => import("./ThemeIconEditor"));
const LazyThemelessEditor = dynamic(() => import("./ThemelessEditor"), { loading: () => <ThemelessLoading /> });
const LazyThemeScholarEditor = dynamic(() => import("./ThemeScholarEditor"), {
  loading: () => <ThemeScholarLoading />,
});

export function ThemeSelection({
  themes,
  state,
  setState,
}: Readonly<{ themes: Theme[]; state: UpdateState; setState: Dispatch<SetStateAction<UpdateState>> }>) {
  const abilityScores = useStaticData().abilityScores;
  const { character } = useParams();
  const [errors, setErrors] = useState<ActionErrors<UpdateThemeInput>>({});

  const characterId = IdSchema.parse(character);
  const selectedTheme = themes.find((r) => r.id === state.theme);

  async function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const themeId = e.target.value;
    const result = await updateTheme({ characterId, themeId });
    if (result.success) {
      setState(result);
    } else {
      setErrors(result.errors);
    }
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Thème</h2>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={selectedTheme?.id ?? ""} onChange={handleThemeChange} isInvalid={!!errors.themeId}>
          {selectedTheme === null && <option value=""></option>}
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && state.theme !== "themeless" && (
        <Stack direction="horizontal" className="right">
          {Object.entries(selectedTheme.abilityScores).map(
            ([key, value]) =>
              value && (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {findOrError(abilityScores, key).code}
                  {displayBonus(value)}
                </Badge>
              )
          )}
        </Stack>
      )}
      {selectedTheme && (
        <>
          <div className="text-muted">{selectedTheme.description}</div>
          <ReferenceComponent reference={selectedTheme.reference} />
        </>
      )}

      {state.theme === "icon" && <LazyThemeIconEditor state={state} setState={setState} />}
      {state.theme === "scholar" && <LazyThemeScholarEditor state={state} setState={setState} />}
      {state.theme === "themeless" && <LazyThemelessEditor state={state} setState={setState} />}
    </Stack>
  );
}
