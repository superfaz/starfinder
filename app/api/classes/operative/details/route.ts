import { IDataSet, DataSetBuilder } from "data";
import { ClassOperative } from "model";

export const dynamic = "force-dynamic";

export async function GET() {
  const builder: DataSetBuilder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  const raw: ClassOperative = (await data.getClassDetails("operative")) as ClassOperative;
  const result: ClassOperative = {
    specializations: raw.specializations,
    features: raw.features,
  };

  return Response.json(result);
}
