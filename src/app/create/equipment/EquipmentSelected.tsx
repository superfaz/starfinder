"use client";

import { EquipmentArmorIds, EquipmentCategories, EquipmentDescriptor, EquipmentWeaponIds } from "model";
import { useCharacterPresenter } from "../helpers";
import { ArmorDisplay } from "./ArmorDisplay";
import { WeaponAmmunitionDisplay } from "./WeaponAmmunitionDisplay";
import { WeaponGrenadeDisplay } from "./WeaponGrenadeDisplay";
import { WeaponMeleeDisplay } from "./WeaponMeleeDisplay";
import { WeaponRangedDisplay } from "./WeaponRangedDisplay";
import { WeaponSolarianDisplay } from "./WeaponSolarianDisplay";
import { ArmorUpgradeDisplay } from "./ArmorUpgradeDisplay";

export function EquipmentDisplay({ descriptor }: Readonly<{ descriptor: EquipmentDescriptor }>) {
  if (descriptor.category === EquipmentCategories.weapon) {
    switch (descriptor.secondaryType) {
      case EquipmentWeaponIds.ammunition:
        return <WeaponAmmunitionDisplay descriptor={descriptor} selected={false} />;
      case EquipmentWeaponIds.basic:
      case EquipmentWeaponIds.advanced:
        return <WeaponMeleeDisplay descriptor={descriptor} selected={false} />;
      case EquipmentWeaponIds.small:
      case EquipmentWeaponIds.long:
      case EquipmentWeaponIds.heavy:
      case EquipmentWeaponIds.sniper:
        return <WeaponRangedDisplay descriptor={descriptor} selected={false} />;
      case EquipmentWeaponIds.grenade:
        return <WeaponGrenadeDisplay descriptor={descriptor} selected={false} />;
      case EquipmentWeaponIds.solarian:
        return <WeaponSolarianDisplay descriptor={descriptor} selected={false} />;
      default:
        return null;
    }
  } else if (descriptor.category === EquipmentCategories.armor) {
    switch (descriptor.secondaryType) {
      case EquipmentArmorIds.light:
      case EquipmentArmorIds.heavy:
      case EquipmentArmorIds.powered:
        return <ArmorDisplay descriptor={descriptor} selected={false} />;
      case EquipmentArmorIds.upgrade:
        return <ArmorUpgradeDisplay descriptor={descriptor} selected={false} />;
      default:
        return null;
    }
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
