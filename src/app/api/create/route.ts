import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DataSets, DataSource, IDataSource } from "data";
import { createCharacter } from "logic/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateDataErrors, CreateDataSchema } from "view";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Security check
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    return new NextResponse(undefined, { status: 401 });
  }

  // Data check
  const data = await request.json();
  const check = CreateDataSchema.safeParse(data);

  if (!check.success) {
    return NextResponse.json(check.error.flatten().fieldErrors, { status: 400 });
  }

  const dataSource: IDataSource = new DataSource();
  const builder = createCharacter(dataSource);
  let errors: CreateDataErrors = {};
  if (check.data.race) {
    try {
      await builder.updateRace(check.data.race);
    } catch {
      errors = { ...errors, race: ["Invalid"] };
    }
  }
  if (check.data.theme) {
    try {
      await builder.updateTheme(check.data.theme);
    } catch {
      errors = { ...errors, theme: ["Invalid"] };
    }
  }
  if (check.data.class) {
    try {
      await builder.updateClass(check.data.class);
    } catch {
      errors = { ...errors, class: ["Invalid"] };
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(errors, { status: 400 });
  }

  // Save character data
  const character = builder.getCharacter();
  await dataSource.get(DataSets.Characters).create(character);

  return NextResponse.json({ id: character.id }, { status: 200 });
}
