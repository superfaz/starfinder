import { DataSets, DataSource, IDataSource } from "data";
import { NextRequest, NextResponse } from "next/server";
import { CreateDataSchema } from "view";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const check = CreateDataSchema.safeParse(data);

  if (!check.success) {
    return NextResponse.json(check.error.flatten().fieldErrors, { status: 400 });
  }

  const dataSource: IDataSource = new DataSource();
  if (check.data.race) {
    try {
      await dataSource.get(DataSets.Races).getOne(check.data.race);
    } catch {
      return NextResponse.json({ race: ["Invalid"] }, { status: 400 });
    }
  }
  if (check.data.theme) {
    try {
      await dataSource.get(DataSets.Themes).getOne(check.data.theme);
    } catch {
      return NextResponse.json({ theme: ["Invalid"] }, { status: 400 });
    }
  }
  if (check.data.class) {
    try {
      await dataSource.get(DataSets.Class).getOne(check.data.class);
    } catch {
      return NextResponse.json({ class: ["Invalid"] }, { status: 400 });
    }
  }

  return new NextResponse(undefined, { status: 200 });
}
