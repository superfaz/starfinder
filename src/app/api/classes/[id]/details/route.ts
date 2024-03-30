import { DataSource, IDataSource, DataSets } from "data";
import { asClassEnvoy, asClassMystic, asClassOperative, asClassSoldier, isIModel } from "model";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const dataSource: IDataSource = new DataSource();
  const dataset = await dataSource.get(DataSets.ClassDetails);

  const raw: unknown = await dataset.getOne(params.id);

  if (!isIModel(raw)) {
    throw new Error("Not a valid response");
  }

  switch (raw.id) {
    case "envoy":
      return Response.json(asClassEnvoy(raw));
    case "operative":
      return Response.json(asClassOperative(raw));
    case "mystic":
      return Response.json(asClassMystic(raw));
    case "soldier":
      return Response.json(asClassSoldier(raw));
    default:
      throw new Error("Not implemented");
  }
}
