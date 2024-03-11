"use client";

import { Stack } from "react-bootstrap";
import { useCharacterPresenter } from "../helpers";
import { FeatComponent } from "./FeatComponent";

export function FeatsInherited() {
  const presenter = useCharacterPresenter();
  const feats = presenter.getInheritedFeats();
  if (feats.length === 0) {
    return null;
  } else {
    return (
      <>
        <h2>Don(s) acqui(s)</h2>
        <Stack direction="vertical" gap={2} className="mb-4" data-testid="feats-inherited">
          {feats.map((feat) => (
            <div key={`${feat.id}-${feat.target}`}>
              <FeatComponent presenter={presenter} feat={feat} noAction />
            </div>
          ))}
        </Stack>
      </>
    );
  }
}
