"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Stack } from "react-bootstrap";
import { ReferenceComponent } from "app/components/ReferenceComponent";
import { displayBonus, findOrError, groupBy } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { Variant } from "model";
import { Badge } from "ui";
import { RaceEntry } from "view/interfaces";
import { updateRace, updateSelectableBonus, updateVariant } from "./actions";
import { State } from "./state";

type Step = "A" | "B" | "C" | "D" | "E";

function SelectButton({
  title,
  onClick,
  selected = false,
  variant = "list",
  imagePath,
}: {
  title: string;
  onClick?: () => void;
  selected?: boolean;
  variant?: "list" | "selected";
  imagePath?: string;
}) {
  const icon = variant === "list" ? "bi bi-check-lg" : "bi bi-pencil-square";
  const buttonVariant = variant === "list" ? "outline-primary" : "outline-success";
  return (
    <Button className={clsx(["sf-select", { selected }])} variant={buttonVariant} onClick={onClick}>
      <div className="sf-icon">
        <i className={icon}></i>
      </div>
      <div className="flex-grow-1 text-start">{title}</div>
      <div className="sf-picture">
        {imagePath && <Image src={imagePath} alt="" width={120} height={40} />}
        {!imagePath && <Image src="/race-unknown-mini.png" alt="" width={120} height={40} />}
      </div>
      <div className="sf-bg-plain"></div>
    </Button>
  );
}

function requireBonusSelection(variant?: Variant): boolean {
  return !!variant && Object.keys(variant.abilityScores).length === 0;
}

function computeStep(searchParams: ReadonlyURLSearchParams, state: State): Step {
  const paramStep = searchParams.get("step");
  switch (paramStep) {
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
      return paramStep;

    default:
      if (!state.race) {
        return "A";
      } else if (!state.variant) {
        return "B";
      } else if (requireBonusSelection(state.variant) && !state.selectableBonus) {
        return "C";
      } else {
        return "D";
      }
  }
}

export function PageContent({ races, initialState }: { races: RaceEntry[]; initialState: State }) {
  const { characterId }: { characterId: string } = useParams();
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const searchParams = useSearchParams();
  const step = useMemo(() => computeStep(searchParams, state), [searchParams, state]);
  const router = useRouter();
  const abilityScores = useStaticData().abilityScores;

  useEffect(() => {
    if (searchParams.get("step") !== step) {
      router.push("?step=" + step);
    }
  }, [searchParams, router, step]);

  function setStep(step: Step) {
    router.push("?step=" + step);
  }

  async function handleRaceSelection(raceId: string) {
    const result = await updateRace({ characterId, raceId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep("B");
      setState(result.value);
    }
  }

  async function handleVariantSelection(variantId: string) {
    const result = await updateVariant({ characterId, variantId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep(requireBonusSelection(result.value.variant) ? "C" : "D");
      setState(result.value);
    }
  }

  async function handleBonusSelection(abilityScoreId: string) {
    const result = await updateSelectableBonus({ characterId, abilityScoreId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep("D");
      setState(result.value);
    }
  }

  const groups = groupBy(races, (i) => i.category);
  return (
    <Stack direction="vertical" gap={2}>
      <div>
        <Badge bg="primary">Etape 1 / 5</Badge>
        <h1>Définition de la race</h1>
      </div>
      <label>Sélectionnez une race</label>
      {errors.raceId && <Alert variant="warning">La race sélectionnée n&apos;est pas valide.</Alert>}
      {step === "A" &&
        Object.entries(groups).map(([key, races]) => (
          <div key={key}>
            <div className="mt-2 text-muted">{key}</div>
            <Stack direction="vertical" gap={2}>
              {races.map((race) => (
                <SelectButton
                  key={race.id}
                  title={race.name}
                  imagePath={undefined}
                  selected={race.id === state.race?.id}
                  onClick={() => handleRaceSelection(race.id)}
                />
              ))}
            </Stack>
          </div>
        ))}
      {step !== "A" && state.race !== undefined && (
        <>
          <SelectButton title={state.race.name} imagePath={undefined} variant="selected" onClick={() => setStep("A")} />
          <div className="text-muted small">{state.race.description}</div>
          <ReferenceComponent reference={state.race.reference} />

          <label>Sélectionnez une variante</label>
          {errors.variantId && <Alert variant="warning">La variante sélectionnée n&apos;est pas valide.</Alert>}
          {step === "B" &&
            state.race.variants.map((variant) => (
              <SelectButton
                key={variant.id}
                title={variant.name}
                imagePath={undefined}
                selected={variant.id === state.variant?.id}
                onClick={() => handleVariantSelection(variant.id)}
              />
            ))}
          {step !== "B" && state.variant !== undefined && (
            <>
              <SelectButton
                title={state.variant.name}
                imagePath={undefined}
                variant="selected"
                onClick={() => setStep("B")}
              />
              {!requireBonusSelection(state.variant) && (
                <Stack direction="horizontal" className="right">
                  {Object.entries(state.variant.abilityScores).map(
                    ([key, value]) =>
                      value && (
                        <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                          {findOrError(abilityScores, key).code} {displayBonus(value)}
                        </Badge>
                      )
                  )}
                </Stack>
              )}
              <div className="text-muted small">{state.variant.description}</div>
              <ReferenceComponent reference={state.variant.reference} />

              {requireBonusSelection(state.variant) && (
                <>
                  <label>Choix de la caractéristique</label>
                  {errors.selectableBonusId && (
                    <Alert variant="warning">La caractéristique sélectionnée n&apos;est pas valide.</Alert>
                  )}

                  {step === "C" &&
                    abilityScores.map((abilityScore) => (
                      <SelectButton
                        key={abilityScore.id}
                        title={abilityScore.name}
                        imagePath={undefined}
                        selected={abilityScore.id === state.selectableBonus?.id}
                        onClick={() => handleBonusSelection(abilityScore.id)}
                      />
                    ))}
                  {step !== "C" && state.selectableBonus !== undefined && (
                    <>
                      <SelectButton
                        title={state.selectableBonus.name}
                        imagePath={undefined}
                        variant="selected"
                        onClick={() => setStep("C")}
                      />
                      <Stack direction="horizontal" className="right">
                        <Badge bg="primary">
                          {state.selectableBonus.code} {displayBonus(2)}
                        </Badge>
                      </Stack>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      {step === "D" && (
        <Button variant="outline-secondary" className="ms-5 mt-3" onClick={() => setStep("E")}>
          (Optionnel) Choisir des traits alternatifs
        </Button>
      )}
      {step === "E" && (
        <>
          <label>Traits de base</label>
          {state.race?.traits.map((trait) => (
            <SelectButton key={trait.id} title={trait.name} imagePath={undefined} selected={false} onClick={() => {}} />
          ))}
          <label>Traits alternatifs</label>
          {state.race?.secondaryTraits.map((trait) => (
            <SelectButton key={trait.id} title={trait.name} imagePath={undefined} selected={false} onClick={() => {}} />
          ))}
        </>
      )}
      {(step === "D" || step == "E") && (
        <Link className="ms-5 btn btn-primary" href="./theme">
          Etape suivante : Définir le thème <i className="bi bi-chevron-right"></i>
        </Link>
      )}
    </Stack>
  );
}
