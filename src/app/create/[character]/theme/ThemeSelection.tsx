"use client";

import dynamic from "next/dynamic";
import { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Badge } from "app/components";
import { displayBonus, findOrError } from "app/helpers";
import { mutators, useAppDispatch, useAppSelector } from "logic";
import { useCharacterPresenter } from "../helpers-client";
import { ReferenceComponent } from "../ReferenceComponent";
import ThemelessLoading from "./ThemelessLoading";
import ThemeScholarLoading from "./ThemeScholarLoading";

const LazyThemeIconEditor = dynamic(() => import("./ThemeIconEditor"));
const LazyThemelessEditor = dynamic(() => import("./ThemelessEditor"), { loading: () => <ThemelessLoading /> });
const LazyThemeScholarEditor = dynamic(() => import("./ThemeScholarEditor"), {
  loading: () => <ThemeScholarLoading />,
});

export function ThemeSelection({ mode = "full" }: Readonly<{ mode: "light" | "full" }>) {
  const abilityScores = useAppSelector((state) => state.data.abilityScores);
  const themes = useAppSelector((state) => state.data.themes);
  const dispatch = useAppDispatch();
  const presenter = useCharacterPresenter();

  if (presenter.getRace() === null) {
    if (mode === "full") {
      return null;
    } else {
      return (
        <Form.FloatingLabel controlId="theme" label="Thème" className="mb-3">
          <Form.Select disabled />
        </Form.FloatingLabel>
      );
    }
  }

  const selectedTheme = presenter.getTheme();

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>): void {
    const id = e.target.value;
    dispatch(mutators.updateTheme(id));
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      {mode === "full" && <h2>Thème</h2>}
      <Form.FloatingLabel controlId="theme" label="Thème">
        <Form.Select value={selectedTheme?.id ?? ""} onChange={handleThemeChange}>
          {selectedTheme === null && <option value=""></option>}
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.FloatingLabel>
      {selectedTheme && mode === "full" && !presenter.isThemeless() && (
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

      {mode === "full" && presenter.isThemeless() && <LazyThemelessEditor presenter={presenter} />}
      {mode === "full" && presenter.isIcon() && <LazyThemeIconEditor presenter={presenter} />}
      {mode === "full" && presenter.isScholar() && <LazyThemeScholarEditor presenter={presenter} />}
    </Stack>
  );
}
