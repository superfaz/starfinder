"use client";

import { useCharacterPresenter } from "../helpers";
import { EquipmentSelection } from "./EquipmentSelection";

export default function Page() {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  return <EquipmentSelection />;
}
