"use client";

import Link from "next/link";
import { Stack } from "react-bootstrap";
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
    <Stack direction="vertical" gap={2}>
      <Link href="/create/equipment" className="btn btn-primary me-auto">
        <i className="bi bi-chevron-left"></i> Retour à la sélection
      </Link>
      {descriptor.category === "weapon" && descriptor.type === "unique" && <WeaponPage descriptor={descriptor} />}
    </Stack>
  );
}
