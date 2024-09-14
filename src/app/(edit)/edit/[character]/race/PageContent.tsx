"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { FormSelectRace } from "app/components/FormSelectRace";
import { useStaticData } from "logic/StaticContext";
import FormSelectVariant from "./FormSelectVariant";
import FormSelectVariantBonus from "./FormSelectVariantBonus";
import { RaceAlternateTraits } from "./RaceAlternateTraits";
import { RaceTraits } from "./RaceTraits";
import { Race } from "model";

export interface IForm {
  race?: string;
  variant?: string;
  selectableBonus?: string;
}

export function PageContent({ races, initial }: Readonly<{ races: Race[]; initial: IForm }>) {
  const avatars = useStaticData().avatars;
  const [raceId, updateRaceId] = useState(initial.race);
  const [variantId, updateVariantId] = useState(initial.variant);
  const [bonus, updateBonus] = useState(initial.selectableBonus);

  const selectedRace = races.find((r) => r.id === raceId);
  const selectedVariant = selectedRace?.variants.find((v) => v.id === variantId);

  function handleRaceChange(e: ChangeEvent<HTMLSelectElement>): void {
    updateRaceId(e.target.value);
  }

  function handleVariantChange(e: ChangeEvent<HTMLSelectElement>): void {
    updateVariantId(e.target.value);
  }

  function handleSelectableBonusChange(e: ChangeEvent<HTMLSelectElement>): void {
    updateBonus(e.target.value);
  }

  function handleSave() {}

  return (
    <Row>
      <Col xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
        <Stack direction="vertical" gap={2} className="mb-3">
          <h2>Race</h2>
          <FormSelectRace races={races} value={raceId ?? ""} onChange={handleRaceChange} />

          {selectedRace && (
            <FormSelectVariant variants={selectedRace.variants} value={variantId ?? ""} onChange={handleVariantChange}>
              {selectedVariant && Object.keys(selectedVariant.abilityScores).length === 0 && (
                <FormSelectVariantBonus value={bonus ?? ""} onChange={handleSelectableBonusChange} />
              )}
            </FormSelectVariant>
          )}

          {selectedRace && (
            <>
              <hr className="d-none d-sm-block" />
              <Card className="d-none d-sm-block">
                <picture>
                  <img
                    alt=""
                    src={"/" + avatars.find((a) => a.tags.includes(selectedRace.id))?.image}
                    className="img-fluid"
                  />
                </picture>
              </Card>
            </>
          )}
        </Stack>
      </Col>
      <Col xs={12} sm={6} className="col-md">
        <Row>
          <Col xs={12} sm={12} md={6} className="mb-3">
            <RaceTraits />
          </Col>
          <Col>
            <RaceAlternateTraits />
          </Col>
        </Row>
      </Col>
      <Col xs={12} className="fixed-bottom py-2 bg-darkblue">
        <Row>
          <Col>
            <Button className="w-100" onClick={handleSave}>
              Modifier
            </Button>
          </Col>
          <Col>
            <Link className="btn btn-outline-secondary w-100" href=".">
              Annuler
            </Link>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
