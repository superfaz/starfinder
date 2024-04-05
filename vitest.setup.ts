import { beforeAll, vi } from "vitest";
import { IDataSource, IDataSet, IDescriptor } from "data";
import { IModel } from "model";
import { addFetchMock, mockFetch } from "./mocks/fetch";
import envoyDetails from "./mocks/class-envoy.json";
import mysticDetails from "./mocks/class-mystic.json";
import operativeDetails from "./mocks/class-operative.json";
import scholarDetails from "./mocks/themes-details.json";
import soldierDetails from "./mocks/class-soldier.json";
import equipmentWeaponsBasic from "./mocks/equipment-weapons-basic.json";

import "@testing-library/jest-dom/vitest";

beforeAll(() => {
  vi.mock("data", async (importOriginal) => {
    const mod = await importOriginal<typeof import("data")>();
    return {
      ...mod,
      DataSource: class MockedDataSource implements IDataSource {
        get<T extends IModel>(descriptor: IDescriptor<T>): IDataSet<T> {
          if (descriptor.name === "classes-details") {
            return {
              getAll: async () => [descriptor.schema.parse((await import(`./mocks/class-operative.json`)).default)],
              getOne: async (id) => (await import(`./mocks/class-${id}.json`)).default,
            };
          }
          if (descriptor.name === "themes-details") {
            return {
              getAll: async () => [descriptor.schema.parse((await import(`./mocks/themes-details.json`)).default)],
              getOne: async () => (await import(`./mocks/${descriptor.name}.json`)).default,
            };
          } else {
            return {
              getAll: async () =>
                descriptor.schema.array().parse((await import(`./mocks/${descriptor.name}.json`)).default),
              getOne: async (id) => (await import(`./mocks/${descriptor.name}-${id}.json`)).default,
            };
          }
        }
      },
    };
  });

  vi.stubGlobal("fetch", mockFetch);
  addFetchMock("/api/classes/envoy/details", envoyDetails);
  addFetchMock("/api/classes/operative/details", operativeDetails);
  addFetchMock("/api/classes/soldier/details", soldierDetails);
  addFetchMock("/api/classes/mystic/details", mysticDetails);
  addFetchMock("/api/equipment/weapons/basic", equipmentWeaponsBasic);
  addFetchMock("/api/themes/scholar", scholarDetails);
});
