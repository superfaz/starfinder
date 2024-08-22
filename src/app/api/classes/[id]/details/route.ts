import { NextRequest } from "next/server";
import { DataSource, IDataSource, DataSets } from "data";
import {
  asClassEnvoy,
  asClassMechanic,
  asClassMystic,
  asClassOperative,
  asClassSolarian,
  asClassSoldier,
  asClassTechnomancer,
  isIModel,
} from "model";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource: IDataSource = new DataSource();
  const dataset = dataSource.get(DataSets.ClassDetails);
  const raw: unknown = await dataset.getOne(params.id);

  if (!isIModel(raw)) {
    throw new Error("Not a valid response");
  }

  switch (raw.id) {
    case "envoy":
      return Response.json(asClassEnvoy(raw));
    case "mechanic":
      return Response.json(asClassMechanic(raw));
    case "mystic":
      return Response.json(asClassMystic(raw));
    case "operative":
      return Response.json(asClassOperative(raw));
    case "solarian":
      return Response.json(asClassSolarian(raw));
    case "soldier":
      return Response.json(asClassSoldier(raw));
    case "technomancer":
      return Response.json(asClassTechnomancer(raw));
    default:
      throw new Error("Not implemented");
  }
}
