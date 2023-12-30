import { IDataSet, DataSetBuilder } from "data";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const builder: DataSetBuilder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  return Response.json(await data.getThemeDetails(params.id));
}
