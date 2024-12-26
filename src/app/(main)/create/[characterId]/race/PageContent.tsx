"use client";

import clsx from "clsx";
import Image from "next/image";
import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { ReferenceComponent } from "app/components/ReferenceComponent";
import { groupBy } from "app/helpers";
import { RaceEntry } from "view/interfaces";
import { updateRace, updateVariant } from "./actions";
import { State } from "./state";

type Step = "A" | "B" | "C";

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
        {imagePath && <Image src={imagePath} alt="" />}
        {!imagePath && <Image src="/race-unknown-mini.png" alt="" />}
      </div>
      <div className="sf-bg-plain"></div>
    </Button>
  );
}

function computeStep(searchParams: ReadonlyURLSearchParams, state: State): Step {
  const paramStep = searchParams.get("step");
  switch (paramStep) {
    case "A":
    case "B":
    case "C":
      return paramStep;

    default:
      if (!state.race) {
        return "A";
      } else if (!state.variant) {
        return "B";
      } else {
        return "C";
      }
  }
}

export function PageContent({ races, initialState }: { races: RaceEntry[]; initialState: State }) {
  const { characterId }: { characterId: string } = useParams();
  const [state, setState] = useState(initialState);
  const searchParams = useSearchParams();
  const step = useMemo(() => computeStep(searchParams, state), [searchParams, state]);
  const router = useRouter();

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
      console.error(result.error);
    } else {
      setStep("B");
      setState(result.value);
    }
  }

  async function handleVariantSelection(variantId: string) {
    const result = await updateVariant({ characterId, variantId });
    if (!result.success) {
      console.error(result.error);
    } else {
      setStep("C");
      setState(result.value);
    }
  }

  switch (step) {
    case "A": {
      const groups = groupBy(races, (i) => i.category);
      return (
        <Stack direction="vertical" gap={2}>
          <h2>Sélectionnez une race</h2>
          {Object.entries(groups).map(([key, races]) => (
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
        </Stack>
      );
    }
    case "B":
      if (state.race === undefined) {
        throw new Error();
      }

      return (
        <Stack direction="vertical" gap={2}>
          <h2>Sélectionnez une race</h2>
          <SelectButton
            key={state.race.id}
            title={state.race.name}
            imagePath={undefined}
            variant="selected"
            onClick={() => setStep("A")}
          />
          <div className="text-muted small">{state.race.description}</div>
          <ReferenceComponent reference={state.race.reference} />

          <h2>Sélectionnez une variante</h2>
          {state.race.variants.map((variant) => (
            <SelectButton
              key={variant.id}
              title={variant.name}
              imagePath={undefined}
              selected={variant.id === state.variant?.id}
              onClick={() => handleVariantSelection(variant.id)}
            />
          ))}
        </Stack>
      );

    case "C":
      if (state.race === undefined || state.variant === undefined) {
        throw new Error();
      }

      return (
        <Stack direction="vertical" gap={2}>
          <h2>Sélectionnez une race</h2>
          <SelectButton
            key={state.race.id}
            title={state.race.name}
            imagePath={undefined}
            variant="selected"
            onClick={() => setStep("A")}
          />
          <div className="text-muted small">{state.race.description}</div>
          <ReferenceComponent reference={state.race.reference} />

          <h2>Sélectionnez une variante</h2>
          <SelectButton
            key={state.variant.id}
            title={state.variant.name}
            imagePath={undefined}
            variant="selected"
            onClick={() => setStep("B")}
          />
          <div className="text-muted small">{state.variant.description}</div>
          <ReferenceComponent reference={state.variant.reference} />
        </Stack>
      );
  }
}
