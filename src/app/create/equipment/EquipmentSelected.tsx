"use client";

import { EquipmentCategories, EquipmentDescriptor } from "model";
import { useCharacterPresenter } from "../helpers";
import { ArmorDisplay } from "./ArmorDisplay";
import { WeaponAmmunitionDisplay } from "./WeaponAmmunitionDisplay";
import { WeaponGrenadeDisplay } from "./WeaponGrenadeDisplay";
import { WeaponMeleeDisplay } from "./WeaponMeleeDisplay";
import { WeaponRangedDisplay } from "./WeaponRangedDisplay";
import { WeaponSolarianDisplay } from "./WeaponSolarianDisplay";

export function EquipmentDisplay({ descriptor }: { descriptor: EquipmentDescriptor }) {
  if (descriptor.category === EquipmentCategories.weapon) {
    switch (descriptor.secondaryType) {
      case "ammunition":
        return <WeaponAmmunitionDisplay descriptor={descriptor} selected={false} />;
      case "basic":
      case "advanced":
        return <WeaponMeleeDisplay descriptor={descriptor} selected={false} />;
      case "small":
      case "long":
      case "heavy":
      case "sniper":
        return <WeaponRangedDisplay descriptor={descriptor} selected={false} />;
      case "grenade":
        return <WeaponGrenadeDisplay descriptor={descriptor} selected={false} />;
      case "solarian":
        return <WeaponSolarianDisplay descriptor={descriptor} selected={false} />;
      default:
        return null;
    }
  } else if (descriptor.category === EquipmentCategories.armor) {
    return <ArmorDisplay descriptor={descriptor} selected={false} />;
  } else {
    return null;
  }
}

export function EquipmentSelected() {
  const presenter = useCharacterPresenter();

  return (
    <>
      <h2>Armes</h2>
      {presenter.getWeapons().length === 0 && <em>Pas d&apos;arme possédée</em>}
      {presenter.getWeapons().map((weapon) => (
        <EquipmentDisplay key={weapon.id} descriptor={weapon} />
      ))}
      <h2>Armures</h2>
      {presenter.getArmors().length === 0 && <em>Pas d&apos;armure possédée</em>}
      {presenter.getArmors().map((armor) => (
        <EquipmentDisplay key={armor.id} descriptor={armor} />
      ))}
      <h2>Autres</h2>
      <em>Pas d&apos;autre objet possédé</em>
    </>
  );
}
