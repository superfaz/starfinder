"use client";

import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers-client";
import { FeatComponent } from "./FeatComponent";

export function FeatsInherited() {
  const presenter = useCharacterPresenter();

  const feats = presenter.getInheritedFeats();

  if (feats.length === 0) {
    return null;
  } else {
    return (
      <Stack direction="vertical" gap={2} className="mb-3" data-testid="feats-inherited">
        <h2>Don(s) acqui(s)</h2>
        {feats.map((feat) => (
          <div key={`${feat.id}-${feat.target}`}>
            <FeatComponent presenter={presenter} feat={feat} noAction />
          </div>
        ))}
      </Stack>
    );
  }
}
