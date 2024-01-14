import { IDataSet, DataSetBuilder } from "data";
import { asClassEnvoy, asClassOperative, asClassSoldier, isIModel } from "model";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const builder: DataSetBuilder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  const raw: unknown = await data.getClassDetails(params.id);

  if (!isIModel(raw)) {
    throw new Error("Not a valid response");
  }

  switch (raw.id) {
    case "envoy":
      return Response.json(asClassEnvoy(raw));
    case "operative":
      return Response.json(asClassOperative(raw));
    case "soldier":
      return Response.json(asClassSoldier(raw));
    default:
      throw new Error("Not implemented");
  }
}
