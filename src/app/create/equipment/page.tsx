"use client";

import { EquipmentSelection } from "./EquipmentSelection";
import { useCharacterPresenter } from "../helpers";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return <EquipmentSelection />;
}
