"use client";

import { useCharacterPresenter } from "../../helpers";
import { WeaponPage } from "./WeaponPage";

export default function Page({ params }: { params: { id: string } }) {
  const presenter = useCharacterPresenter();
  if (presenter.getRace() === null || presenter.getTheme() === null || presenter.getClass() === null) {
    return null;
  }

  let descriptor;
  try {
    descriptor = presenter.getEquipment(params.id);
  } catch (e) {
    return null;
  }

  return (
    <>{descriptor.category === "weapon" && descriptor.type === "unique" && <WeaponPage descriptor={descriptor} />}</>
  );
}
