import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DataSets, DataSource, IDataSource } from "data";
import { updateCharacter } from "logic/server";
import { NextRequest, NextResponse } from "next/server";
import { CreateDataErrors, EditDataSchema } from "view";

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
  const check = EditDataSchema.safeParse(data);

  if (!check.success) {
    return NextResponse.json(check.error.flatten().fieldErrors, { status: 400 });
  }

  const dataSource: IDataSource = new DataSource();
  const character = await dataSource.get(DataSets.Characters).findOne(check.data.id);

  if (!character) {
    return NextResponse.json(undefined, { status: 404 });
  }
  if (character.userId != user.id) {
    return NextResponse.json(undefined, { status: 403 });
  }

  const builder = updateCharacter(dataSource, character);
  let errors: CreateDataErrors = {};

  for (const step of check.data.steps) {
    if (step.action === "edit") {
      if (step.field === "race") {
        if (!(await builder.update(step.field, step.value))) {
          errors = { ...errors, [step.field]: ["Invalid"] };
        }
      }
    } else {
      console.error(`Unknown action type '${step.action}'`);
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(errors, { status: 400 });
  }

  // Save character data
  await dataSource.get(DataSets.Characters).update(character);

  return NextResponse.json({ id: character.id }, { status: 200 });
}
