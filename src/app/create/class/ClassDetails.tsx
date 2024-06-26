"use client";

import dynamic from "next/dynamic";
import Stack from "react-bootstrap/Stack";
import { useCharacterPresenter } from "../helpers";
import ClassDetailsLoading from "./ClassDetailsLoading";

const LazyClassDetailsGeneric = dynamic(() => import("./ClassDetailsGeneric"), {
  loading: () => <ClassDetailsLoading />,
});
const LazyClassDetailsSolarian = dynamic(() => import("./ClassDetailsSolarian"), {
  loading: () => <ClassDetailsLoading />,
});

function LazyClassDetails(): JSX.Element | null {
  const presenter = useCharacterPresenter();
  const selectedClass = presenter.getClass();

  if (!selectedClass) {
    return null;
  }

  switch (selectedClass.id) {
    case "envoy":
    case "operative":
    case "mechanic":
    case "mystic":
    case "soldier":
    case "technomancer":
      return <LazyClassDetailsGeneric presenter={presenter} classId={selectedClass.id} />;

    case "solarian":
      return <LazyClassDetailsSolarian presenter={presenter} classId={selectedClass.id} />;

    default:
      return null;
  }
}

export function ClassDetails() {
  const presenter = useCharacterPresenter();
  if (presenter.getTheme() === null) {
    return null;
  }

  return (
    <Stack direction="vertical" gap={2} className="mb-3">
      <h2>Abilités de classe</h2>
      <LazyClassDetails />
    </Stack>
  );
}
