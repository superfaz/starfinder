import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DataSets, DataSource, IDataSource } from "data";
import { createCharacter } from "logic/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateDataErrors, CreateDataSchema } from "view";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Security check
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    return new NextResponse(undefined, { status: 401 });
  }

  // Data check
  const data = await request.json();
  const check = CreateDataSchema.safeParse(data);

  if (!check.success) {
    return NextResponse.json(check.error.flatten().fieldErrors, { status: 400 });
  }

  const dataSource: IDataSource = new DataSource();
  const builder = createCharacter(dataSource, user.id);
  let errors: CreateDataErrors = {};
  if (check.data.race && !(await builder.updateRace(check.data.race))) {
    errors = { ...errors, race: ["Invalid"] };
  }
  if (check.data.theme && !(await builder.updateTheme(check.data.theme))) {
    errors = { ...errors, theme: ["Invalid"] };
  }
  if (check.data.class && !(await builder.updateClass(check.data.class))) {
    errors = { ...errors, class: ["Invalid"] };
  }
  if (check.data.name && !(await builder.updateName(check.data.name))) {
    errors = { ...errors, name: ["Invalid"] };
  }
  if (check.data.description && !(await builder.updateDescription(check.data.description))) {
    errors = { ...errors, description: ["Invalid"] };
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(errors, { status: 400 });
  }

  // Save character data
  const character = builder.getCharacter();
  await dataSource.get(DataSets.Characters).create(character);

  return NextResponse.json({ id: character.id }, { status: 200 });
}