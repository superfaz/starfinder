import { IDataSet, DataSetBuilder } from "data";
import { ClassEnvoy, ClassOperative, IModel } from "model";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isOperative(raw: IModel): raw is ClassOperative {
  return raw.id === "operative";
}

function isEnvoy(raw: IModel): raw is ClassEnvoy {
  return raw.id === "envoy";
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const builder: DataSetBuilder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  const raw: IModel = (await data.getClassDetails(params.id)) as IModel;

  if (!("id" in raw)) {
    throw new Error("Not a valid response");
  }

  if (isOperative(raw)) {
    const result: ClassOperative = {
      id: raw.id,
      specializations: raw.specializations,
      features: raw.features,
    };

    return Response.json(result);
  } else if (isEnvoy(raw)) {
    const result: ClassEnvoy = {
      id: raw.id,
      features: raw.features,
    };

    return Response.json(result);
  } else {
    throw new Error("Not implemented");
  }
}
