"use client";

import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import dynamic from "next/dynamic";

const LazyClassDetailsGeneric = dynamic(() => import("./ClassDetailsGeneric"));

function LazyClassDetails(): JSX.Element | null {
  const presenter = useCharacterPresenter();
  const selectedClass = presenter.getClass();

  if (!selectedClass) {
    console.log("selectedClass.id", "none selected");
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
    case "operative":
    case "mystic":
    case "soldier":
      console.log("selectedClass.id", selectedClass.id);
      return <LazyClassDetailsGeneric character={presenter} classId={selectedClass.id} />;

    default:
      return null;
  }
}

export function ClassDetails() {
  return (
    <Stack direction="vertical" gap={2}>
      <h2>Abilités de classe</h2>
      <LazyClassDetails />
    </Stack>
  );
}
