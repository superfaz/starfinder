import { beforeAll, vi } from "vitest";
import { ArmorTypeIds, EquipmentWeaponIds } from "model";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import deities from "./mocks/deities.json";
import envoyDetails from "./mocks/class-envoy.json";
import mechanicDetails from "./mocks/class-mechanic.json";
import mysticDetails from "./mocks/class-mystic.json";
import operativeDetails from "./mocks/class-operative.json";
import soldierDetails from "./mocks/class-soldier.json";
import fusionsDetails from "./mocks/equipment-weapons-fusion.json";
import languages from "./mocks/languages.json";
import scholarDetails from "./mocks/themes-details.json";
import worlds from "./mocks/worlds.json";

import "@testing-library/jest-dom/vitest";

beforeAll(async () => {
  vi.stubGlobal("fetch", mockFetch);

  addFetchMock("/api/auth/setup", {});
  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/classes/mechanic/details", mechanicDetails);
  addFetchMock("/api/classes/mystic/details", mysticDetails);
  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/soldier/details", soldierDetails);
  addFetchMock("/api/deities", deities);
  addFetchMock("/api/equipment/weapons/fusions", fusionsDetails);
  addFetchMock("/api/themes/scholar", scholarDetails);
  addFetchMock("/api/worlds", worlds);
  addFetchMock("/api/languages", languages);

  for (const armorType in ArmorTypeIds) {
    addFetchMock(
      `/api/equipment/armors/${armorType}`,
      (await import(`./mocks/equipment-armors-${armorType}.json`)).default
    );
  }

  for (const weaponType in EquipmentWeaponIds) {
    addFetchMock(
      `/api/equipment/weapons/${weaponType}`,
      (await import(`./mocks/equipment-weapons-${weaponType}.json`)).default
    );
  }
});
