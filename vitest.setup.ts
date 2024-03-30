import { beforeAll, vi } from "vitest";
import { IDataSource, IDataSet, IDescriptor } from "data";
import { IModel } from "model";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import envoyDetails from "./mocks/class-envoy.json";
import operativeDetails from "./mocks/class-operative.json";
import scholarDetails from "./mocks/themes-details.json";
import soldierDetails from "./mocks/class-soldier.json";
import equipmentWeaponMelee from "./mocks/equipment-weapon-melee.json";

import "@testing-library/jest-dom/vitest";

process.env.STARFINDER_COSMOS_ENDPOINT = "https://localhost:8081";
process.env.STARFINDER_COSMOS_KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
process.env.STARFINDER_COSMOS_DATABASE = "starfinder";

class MockedDataSource implements IDataSource {
  async get<T extends IModel>(descriptor: IDescriptor<T>): Promise<IDataSet<T>> {
    return {
      getAll: async () => descriptor.schema.array().parse((await import(`./mocks/${descriptor.name}.json`)).default),
      getOne: async (id) => (await import(`./mocks/${descriptor.name}-${id}.json`)).default,
    };
  }
}

beforeAll(() => {
  vi.mock("data", async (importOriginal) => {
    const mod = await importOriginal<typeof import("data")>();
    return {
      ...mod,
      DataSource: MockedDataSource,
    };
  });

  vi.stubGlobal("fetch", mockFetch);
  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/soldier/details", soldierDetails);
  addFetchMock("/api/equipments/weapon/basic", equipmentWeaponMelee);
  addFetchMock("/api/themes/scholar", scholarDetails);
});
