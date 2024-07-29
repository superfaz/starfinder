"use client";

import { useParams } from "next/navigation";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { CreditsDisplay } from "./CreditsDisplay";
import { EquipmentSelected } from "./EquipmentSelected";
import { WeaponMeleeDisplay } from "./WeaponMeleeDisplay";
import { WeaponRangedDisplay } from "./WeaponRangedDisplay";
import { WeaponSolarianDisplay } from "./WeaponSolarianDisplay";
import { useCharacterPresenter } from "../helpers-client";
import { isMelee, isRanged } from "model";
import { ArmorDisplay } from "./ArmorDisplay";

function EquipmentEdited({ id }: Readonly<{ id: string }>) {
  const presenter = useCharacterPresenter();
  const descriptor = presenter.getEquipment(id);

  if (descriptor.category === "weapon") {
    return (
      <>
        <h2>Arme modifiée</h2>
        {isMelee(descriptor.secondaryType) && <WeaponMeleeDisplay descriptor={descriptor} selected={true} />}
        {isRanged(descriptor.secondaryType) && <WeaponRangedDisplay descriptor={descriptor} selected={true} />}
        {descriptor.secondaryType === "solarian" && <WeaponSolarianDisplay descriptor={descriptor} selected={true} />}
      </>
    );
  } else if (descriptor.category === "armor") {
    return (
      <>
        <h2>Armure modifiée</h2>
        <ArmorDisplay descriptor={descriptor} selected={true} />
      </>
    );
  } else {
    return null;
  }
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { id }: { id: string } = useParams();
  const isList = id === undefined;

  return (
    <>
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <Stack direction="vertical" gap={2}>
          <CreditsDisplay />
          {isList && <EquipmentSelected />}
          {!isList && <EquipmentEdited id={id} />}
        </Stack>
      </Col>
      <Col>{children}</Col>
    </>
  );
}
