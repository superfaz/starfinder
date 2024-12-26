import { addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { redirect } from "next/navigation";
import { characterService, createEmptyBuilder, prepareContext } from "logic/server";
import { DataSourceError } from "logic";
import { serverError } from "navigation";

export default async function Page() {
  const context = await prepareContext("/create");

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(createEmptyBuilder))
    .add(onSuccessGrouped(({ builder }) => succeed({ character: builder.character })))
    .add(onSuccessGrouped(characterService.create))
    .runAsync();

  if (!action.success) {
    if (action.error instanceof DataSourceError) {
      return serverError(action.error);
    } else {
      return serverError();
    }
  }

  redirect("/create/" + action.value.id);
}
