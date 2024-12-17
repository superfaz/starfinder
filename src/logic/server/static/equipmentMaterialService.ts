import { PromisedResult } from "chain-of-actions";
import { IStaticDescriptor } from "data";
import { DataSourceError, NotFoundError } from "logic/errors";
import { EquipmentMaterial, EquipmentMaterialSchema } from "model";
import { IRetrieveAllParams, retrieveAll, retrieveOne } from "./_services";

const descriptor: IStaticDescriptor<EquipmentMaterial> = {
  mode: "static",
  type: "ordered",
  name: "equipment-material",
  schema: EquipmentMaterialSchema,
};

export const equipmentMaterialService = {
  retrieveAll: (params: IRetrieveAllParams) =>
    retrieveAll(params, descriptor, "equipmentMaterials") as PromisedResult<
      { equipmentMaterials: EquipmentMaterial[] },
      DataSourceError
    >,

  retrieveOne: (params: IRetrieveAllParams & { equipmentMaterialId: string }) =>
    retrieveOne(
      { dataSource: params.dataSource, id: params.equipmentMaterialId },
      descriptor,
      "equipmentMaterial"
    ) as PromisedResult<{ equipmentMaterial: EquipmentMaterial }, DataSourceError | NotFoundError>,
};
