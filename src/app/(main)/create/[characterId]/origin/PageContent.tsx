"use client";

import Link from "next/link";
import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Accordion, Stack } from "react-bootstrap";
import { ReferenceComponent } from "app/components/ReferenceComponent";
import { displayBonus, findOrError } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { AbilityScore, Variant } from "model";
import { Badge } from "ui";
import { OriginEntry } from "view/interfaces";
import { updateOrigin, updateSecondaryTrait, updateSelectableBonus, updateVariant } from "./actions";
import { State } from "./state";
import StepSelectOrigin from "./StepSelectOrigin";
import StepSelectVariant from "./StepSelectVariant";
import StepSelectAlternativeTraits from "./StepSelectAlternativeTraits";
import StepSelectAbilityScore from "./StepSelectAbilityScore";
import FeatureDescription from "./FeatureDescription";

type Step = "A" | "B" | "C" | "D" | "E";

function requireBonusSelection(variant?: Variant): boolean {
  return !!variant && Object.keys(variant.abilityScores).length === 0;
}

function computeStep(searchParams: ReadonlyURLSearchParams, state: State): Step | undefined {
  const paramStep = searchParams.get("step");
  switch (paramStep) {
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
      return paramStep;

    default:
      return !state.origin ? "A" : undefined;
  }
}

function VariantBonuses({ variant, selectableBonus }: { variant: Variant; selectableBonus?: AbilityScore }) {
  const abilityScores = useStaticData().abilityScores;

  if (requireBonusSelection(variant)) {
    if (selectableBonus) {
      return (
        <Stack direction="horizontal" className="right">
          <Badge bg="primary">
            {selectableBonus.code} {displayBonus(2)}
          </Badge>
        </Stack>
      );
    } else {
      return (
        <Stack direction="horizontal" className="right">
          <Badge bg="primary">Au choix {displayBonus(2)}</Badge>
        </Stack>
      );
    }
  } else {
    return (
      <Stack direction="horizontal" className="right">
        {Object.entries(variant.abilityScores).map(
          ([key, value]) =>
            value && (
              <Badge key={key} bg={value > 0 ? "primary" : "secondary"}>
                {findOrError(abilityScores, key).code} {displayBonus(value)}
              </Badge>
            )
        )}
      </Stack>
    );
  }
}

export function PageContent({ origins, initialState }: { origins: OriginEntry[]; initialState: State }) {
  const { characterId }: { characterId: string } = useParams();
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const searchParams = useSearchParams();
  const step = useMemo(() => computeStep(searchParams, state), [searchParams, state]);
  const router = useRouter();

  function setStep(step: Step | undefined) {
    if (step === undefined) {
      router.push(".");
    } else {
      router.push("?step=" + step);
    }
  }

  async function handleOriginSelection(originId: string) {
    const result = await updateOrigin({ characterId, originId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep(undefined);
      setState(result.value);
    }
  }

  async function handleVariantSelection(variantId: string) {
    const result = await updateVariant({ characterId, variantId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep(undefined);
      setState(result.value);
    }
  }

  async function handleTraitSelection(traitId: string, enable: boolean) {
    const result = await updateSecondaryTrait({ characterId, traitId, enable });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setState(result.value);
    }
  }

  async function handleBonusSelection(abilityScoreId: string) {
    const result = await updateSelectableBonus({ characterId, abilityScoreId });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setStep(undefined);
      setState(result.value);
    }
  }

  return (
    <main className="vstack gap-2">
      <div>
        <Badge bg="primary">Etape 1 / 5</Badge>
        <h1>Choix de l&apos;espèce</h1>
      </div>
      {step === "A" ? (
        <StepSelectOrigin
          origins={origins}
          selectedId={state.origin?.id ?? ""}
          error={!!errors.originId}
          onSelect={handleOriginSelection}
        />
      ) : step === "C" ? (
        <StepSelectVariant
          variants={state.origin?.variants ?? []}
          selectedId={state.variant?.id ?? ""}
          error={!!errors.variantId}
          onSelect={handleVariantSelection}
        />
      ) : step === "D" ? (
        <StepSelectAlternativeTraits
          traits={state.origin?.traits ?? []}
          secondaryTraits={state.origin?.secondaryTraits ?? []}
          selectedTraits={state.selectedTraits}
          error={!!errors.traitId}
          onSelect={handleTraitSelection}
        />
      ) : step === "E" ? (
        <StepSelectAbilityScore
          selectedId={state.selectableBonus?.id ?? ""}
          error={!!errors.abilityScoreId}
          onSelect={handleBonusSelection}
        />
      ) : (
        <>
          {state.origin && (
            <section className="vstack gap-2 mb-3">
              <Link href="?step=A" className="sf-edit form-floating">
                <div className="form-control is-valid">{state.origin.name}</div>
                <label className="form-label">Espèce</label>
              </Link>
              <p>{state.origin.description}</p>
              <ReferenceComponent reference={state.origin.reference} />
            </section>
          )}

          {state.variant && (
            <section className="vstack gap-2 mb-3">
              <Link href="?step=C" className="sf-edit form-floating">
                <div className="form-control is-valid">{state.variant.name}</div>
                <label className="form-label">Variante</label>
              </Link>
              <VariantBonuses variant={state.variant} selectableBonus={state.selectableBonus} />
              {state.variant.description && <p>{state.variant.description}</p>}
              <ReferenceComponent reference={state.variant.reference} />
            </section>
          )}
          <Link className="ms-5 mb-5 btn btn-outline-secondary" href="?step=C">
            (Optionnel) Choisir une variante d&apos;espèce <i className="bi bi-chevron-right"></i>
          </Link>
          {state.origin && state.selectedTraits.length > 0 && (
            <section className="vstack gap-2 mb-3">
              <h4>Traits d&apos;espèce</h4>
              <Accordion flush>
                {[...state.origin.traits, ...state.origin.secondaryTraits]
                  .filter((t) => state.selectedTraits.includes(t.id))
                  .map((trait) => (
                    <Accordion.Item key={trait.id} eventKey={trait.id}>
                      <Accordion.Header as="div">{trait.name}</Accordion.Header>
                      <Accordion.Body>
                        <FeatureDescription feature={trait} />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </section>
          )}
          <Link className="ms-5 mb-5 btn btn-outline-secondary" href="?step=D">
            (Optionnel) Choisir des traits alternatifs <i className="bi bi-chevron-right"></i>
          </Link>
          <Link className="ms-5 btn btn-primary" href="./theme">
            Etape suivante : Définir le thème <i className="bi bi-chevron-right"></i>
          </Link>
        </>
      )}
    </main>
  );
}
