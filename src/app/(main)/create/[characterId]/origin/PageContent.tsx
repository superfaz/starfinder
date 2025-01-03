"use client";

import Link from "next/link";
import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Alert, Button, Stack } from "react-bootstrap";
import { ReferenceComponent } from "app/components/ReferenceComponent";
import { displayBonus, findOrError, groupBy } from "app/helpers";
import { useStaticData } from "logic/StaticContext";
import { Variant } from "model";
import { Badge, EntryButton, EntryListComponent } from "ui";
import { RaceEntry } from "view/interfaces";
import { updateOrigin, updateSelectableBonus, updateVariant } from "./actions";
import { State } from "./state";
import { updateSecondaryTrait } from "./actions/updateSecondaryTrait";
import clsx from "clsx";
import { OriginFeature } from "view";

type Step = "A" | "B" | "C" | "D" | "E";

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
      if (!state.origin) {
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

export function PageContent({ origins, initialState }: { origins: RaceEntry[]; initialState: State }) {
  const { characterId }: { characterId: string } = useParams();
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [infoId, setInfoId] = useState<string | undefined>(undefined);
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

  function isSelected(traitId: string) {
    return state.selectedTraits.includes(traitId);
  }

  function isSelectable(trait: OriginFeature) {
    return trait.replace.every((t) => state.selectedTraits.includes(t.id));
  }

  async function handleOriginSelection(originId: string) {
    const result = await updateOrigin({ characterId, originId });
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

  async function handleTraitSelection(traitId: string) {
    const enable = !isSelected(traitId);
    const result = await updateSecondaryTrait({ characterId, traitId, enable });
    if (!result.success) {
      setErrors(result.error.errors);
    } else {
      setState(result.value);
    }
  }

  const groups = groupBy(origins, (i) => i.category);
  return (
    <main className="vstack gap-2">
      <div>
        <Badge bg="primary">Etape 1 / 5</Badge>
        <h1>Définition de l&apos;espèce</h1>
      </div>
      <section className="vstack gap-2 mb-3">
        <label>Sélectionnez une espèce</label>
        {errors.originId && <Alert variant="warning">L&apqs;espèce sélectionnée n&apos;est pas valide.</Alert>}
        {step === "A" &&
          Object.entries(groups).map(([groupName, origins]) => (
            <Fragment key={groupName}>
              <div className="mt-2 text-muted">{groupName}</div>
              {origins.map((origin) => (
                <EntryListComponent
                  key={origin.id}
                  entry={origin}
                  variant={origin.id === state.origin?.id ? "selected" : "standard"}
                  onClick={() => handleOriginSelection(origin.id)}
                  hasInfo={!!origin.description}
                  infoId={infoId}
                  setInfoId={setInfoId}
                >
                  <>
                    <div className="small text-muted">{origin.description}</div>
                    <ReferenceComponent reference={origin.reference} />
                    <Button>Sélectionner</Button>
                  </>
                </EntryListComponent>
              ))}
            </Fragment>
          ))}
        {step > "A" && state.origin !== undefined && (
          <>
            <EntryButton
              title={state.origin.name}
              imagePath="/origin-unknown-mini.png"
              variant="edit"
              onClick={() => setStep("A")}
            />
            <div className="text-muted small">{state.origin.description}</div>
            <ReferenceComponent reference={state.origin.reference} />
          </>
        )}
      </section>

      {step > "A" && state.origin !== undefined && (
        <section className="vstack gap-2 mb-3">
          <label>Sélectionnez une variante</label>
          {errors.variantId && <Alert variant="warning">La variante sélectionnée n&apos;est pas valide.</Alert>}
          {step === "B" &&
            state.origin.variants.map((variant) => (
              <EntryListComponent
                key={variant.id}
                entry={variant}
                variant={variant.id === state.variant?.id ? "selected" : "standard"}
                onClick={() => handleVariantSelection(variant.id)}
                hasInfo={!!variant.description}
                infoId={infoId}
                setInfoId={setInfoId}
              >
                <>
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
                  <div className="small text-muted">{variant.description}</div>
                  <ReferenceComponent reference={variant.reference} />
                </>
              </EntryListComponent>
            ))}
          {step > "B" && state.variant !== undefined && (
            <>
              <EntryButton
                title={state.variant.name}
                imagePath="/origin-unknown-mini.png"
                variant="edit"
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
            </>
          )}
        </section>
      )}

      {step > "B" && state.variant !== undefined && requireBonusSelection(state.variant) && (
        <section className="vstack gap-2 mb-3">
          <label>Choix de la caractéristique</label>
          {errors.selectableBonusId && (
            <Alert variant="warning">La caractéristique sélectionnée n&apos;est pas valide.</Alert>
          )}

          {step === "C" &&
            abilityScores.map((abilityScore) => (
              <EntryButton
                key={abilityScore.id}
                title={abilityScore.name}
                imagePath={undefined}
                variant={abilityScore.id === state.selectableBonus?.id ? "selected" : "standard"}
                onClick={() => handleBonusSelection(abilityScore.id)}
              />
            ))}
          {step > "C" && state.selectableBonus !== undefined && (
            <>
              <EntryButton
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
        </section>
      )}

      {step === "D" && state.origin && (
        <>
          <section className="vstack gap-2 mb-3">
            <label>Traits d&apos;espèce</label>
            {state.origin.traits
              .filter((t) => isSelected(t.id))
              .map((trait) => (
                <Stack key={trait.id} direction="horizontal" gap={2}>
                  <div className="p-2 border rounded border-secondary flex-grow-1">{trait.name}</div>
                  <Button variant="link" className="py-2" onClick={() => setInfoId(trait.id)}>
                    <i className="bi bi-info-circle"></i>
                  </Button>
                </Stack>
              ))}
            {state.origin.secondaryTraits
              .filter((t) => isSelected(t.id))
              .map((trait) => (
                <Stack key={trait.id} direction="horizontal" gap={2}>
                  <div className="p-2 border rounded border-secondary flex-grow-1">{trait.name}</div>
                  <Button variant="link" className="py-2" onClick={() => setInfoId(trait.id)}>
                    <i className="bi bi-info-circle"></i>
                  </Button>
                </Stack>
              ))}
          </section>
          <Button variant="outline-secondary" className="ms-5 mt-3" onClick={() => setStep("E")}>
            (Optionnel) Choisir des traits alternatifs
          </Button>
        </>
      )}

      {step === "E" && (
        <section className="vstack gap-2 mb-3">
          <label>Sélectionnez les traits d&apos;espèce</label>
          <div className="mt-2 text-muted">Traits de base</div>
          {state.origin?.traits.map((trait) => (
            <Stack key={trait.id} direction="horizontal" gap={2}>
              {isSelected(trait.id) && (
                <div className="p-2 rounded bg-success">
                  <i className="bi bi-check-lg"></i>
                </div>
              )}
              {!isSelected(trait.id) && (
                <div className="p-2 rounded bg-danger">
                  <i className="bi bi-x-lg"></i>
                </div>
              )}
              <div
                className={clsx("p-2 border rounded border-secondary flex-grow-1", {
                  "text-secondary": !isSelected(trait.id),
                })}
              >
                {trait.name}
              </div>
              <Button variant="link" className="py-2">
                <i className="bi bi-info-circle"></i>
              </Button>
            </Stack>
          ))}
          <div className="mt-2 text-muted">Traits alternatifs</div>
          {state.origin?.secondaryTraits.map((trait) => (
            <EntryListComponent
              key={trait.id}
              entry={trait}
              hasInfo={true}
              selected={isSelected(trait.id)}
              disabled={!isSelected(trait.id) && !isSelectable(trait)}
              infoId={infoId}
              setInfoId={setInfoId}
              onClick={() => handleTraitSelection(trait.id)}
            ></EntryListComponent>
          ))}
        </section>
      )}

      {step >= "D" && (
        <Link className="ms-5 btn btn-primary" href="./theme">
          Etape suivante : Définir le thème <i className="bi bi-chevron-right"></i>
        </Link>
      )}
    </main>
  );
}
