"use client";

import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus, findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers";
import { ReferenceComponent } from "../ReferenceComponent";
import ThemeNoneLoading from "./ThemeNoneLoading";
import ThemeScholarLoading from "./ThemeScholarLoading";

const LazyThemeNoneEditor = dynamic(() => import("./ThemeNoneEditor"), { loading: () => <ThemeNoneLoading /> });
const LazyThemeScholarEditor = dynamic(() => import("./ThemeScholarEditor"), { loading: () => <ThemeScholarLoading /> });

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
    <Stack direction="vertical" gap={2} className="mb-3">
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
      {presenter.hasNoTheme() && <LazyThemeNoneEditor character={presenter} className="mt-3" />}
      {presenter.isScholar() && <LazyThemeScholarEditor character={presenter} className="mt-3" />}
    </Stack>
  );
}
