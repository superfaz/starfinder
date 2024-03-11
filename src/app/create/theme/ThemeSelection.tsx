"use client";

import { mutators, useAppDispatch, useAppSelector } from "logic";
import { ChangeEvent } from "react";
import { Badge, Form, Stack } from "react-bootstrap";
import { displayBonus, findOrError } from "app/helpers";
import { ReferenceComponent } from "../ReferenceComponent";
import dynamic from "next/dynamic";
import { useCharacterPresenter } from "../helpers";

const LazyThemeNoneEditor = dynamic(() => import("./ThemeNoneEditor"));
const LazyThemeScholarEditor = dynamic(() => import("./ThemeScholarEditor"));

export function ThemeSelection() {
  const data = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();
  const presenter = useCharacterPresenter();

  if (presenter.getRace() === null) {
    return null;
  }

  const selectedTheme = presenter.getTheme();

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateTheme(id));
  }

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Thème</h2>
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={selectedTheme?.id ?? ""} onChange={handleThemeChange}>
          {selectedTheme === null && <option value=""></option>}
          {data.themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && !presenter.hasNoTheme() && (
        <Stack direction="horizontal" className="right">
          {Object.entries(selectedTheme.abilityScores).map(
            ([key, value]) =>
              value && (
                <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                  {findOrError(data.abilityScores, key).code}
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
      <div className="mt-3">
        {presenter.hasNoTheme() && <LazyThemeNoneEditor character={presenter} />}
        {presenter.isScholar() && <LazyThemeScholarEditor character={presenter} />}
      </div>
    </Stack>
  );
}
