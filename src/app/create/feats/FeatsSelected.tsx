"use client";

import { Stack } from "react-bootstrap";
import { FeatComponent } from "./FeatComponent";
import { useCharacterPresenter } from "../helpers";

export function FeatsSelected() {
  const presenter = useCharacterPresenter();
  const feats = presenter.getSelectedFeats();
  const featCount = presenter.getSelectableFeatCount();

  return (
    <Stack direction="vertical" gap={2}>
      <h2>Don(s) sélectionné(s)</h2>
      <div className="text-muted mb-3">
        <span className="rounded border bg-body-secondary py-2 px-3">{featCount}</span> à choisir
      </div>
      <Stack direction="vertical" gap={2} className="mb-4" data-testid="feats-selected">
        {feats.map((feat) => (
          <div key={feat.id}>
            <FeatComponent presenter={presenter} feat={feat} />
          </div>
        ))}
      </Stack>
    </Stack>
  );
}
