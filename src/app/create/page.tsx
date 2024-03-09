"use client";

import { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { useCookies } from "react-cookie";
import { CharacterPresenter, useAppSelector } from "logic";
import * as Tab from "./tabs";

export default function Page() {
  const data = useAppSelector((state) => state.data);
  const navigation = useAppSelector((state) => state.navigation);
  const character = useAppSelector((state) => state.character);
  const classesDetails = useAppSelector((state) => state.classesDetails);
  const presenter = useMemo(
    () => new CharacterPresenter(data, classesDetails, character),
    [data, classesDetails, character]
  );

  const selectedRace = presenter.getRace();
  const selectedTheme = presenter.getTheme();
  const selectedClass = presenter.getClass();

  const [, setCookie] = useCookies(["character"]);
  useEffect(() => {
    setCookie("character", JSON.stringify(character));
  }, [character, setCookie]);

  return (
    <Row id="content">
      {navigation === "intro" && (
        <Col lg={6}>
          <Tab.Intro />
        </Col>
      )}

      {navigation === "race" && (
        <>
          <Col lg={3}>
            <Tab.RaceSelection character={presenter} />
          </Col>
          <Col>
            <Tab.RaceTraits character={presenter} />
          </Col>
          <Col>
            <Tab.RaceAlternateTraits character={presenter} />
          </Col>
        </>
      )}

      {navigation === "theme" && (
        <>
          <Col lg={3}>
            <Tab.ThemeSelection character={presenter} />
          </Col>
          <Col>
            <Tab.ThemeTraits character={presenter} />
          </Col>
        </>
      )}

      {navigation === "class" && (
        <>
          <Col lg={3}>
            <Tab.ClassSelection character={presenter} />
          </Col>
          <Col>
            <Tab.ClassDetails character={presenter} />
          </Col>
        </>
      )}

      {navigation === "profile" && (
        <>
          <Col lg={3}>
            <Tab.Profile character={presenter} />
          </Col>
          <Col lg={3}>
            <Tab.Avatar character={presenter} />
          </Col>
          <Col lg={6}>
            <Tab.Description character={presenter} />
          </Col>
        </>
      )}
      {navigation === "abilityScores" && (
        <>
          <Col lg={4}>
            <Stack direction="vertical" gap={4}>
              <Tab.AbilityScores character={presenter} />
              <Tab.ProfessionSkills />
            </Stack>
          </Col>
          <Col lg={4}>
            <Tab.Skills character={presenter} />
          </Col>
          <Col lg={4}>
            <Tab.SkillsModifiers character={presenter} />
          </Col>
        </>
      )}

      {navigation === "feats" && (
        <>
          <Col lg={3}>
            <Tab.FeatsInherited character={presenter} />
            <Tab.FeatsSelected character={presenter} />
          </Col>
          <Col>
            <Tab.FeatsSelection character={presenter} />
          </Col>
        </>
      )}

      {navigation === "spells" && (
        <Col lg={12}>
          <Tab.SpellsSelection character={presenter} />
        </Col>
      )}

      {navigation === "equipment" && (
        <>
          <Col lg={3}>
            <Tab.EquipmentSelected />
          </Col>
          <Col>
            <Tab.EquipmentSelection />
          </Col>
        </>
      )}

      {navigation === "sheet" && (
        <Col lg={12}>
          <Tab.Sheet character={presenter} />
        </Col>
      )}

      {navigation === "debug" && (
        <Col lg={12}>
          <h5>Character</h5>
          <pre>{JSON.stringify(character, null, 2)}</pre>
        </Col>
      )}
    </Row>
  );
}
