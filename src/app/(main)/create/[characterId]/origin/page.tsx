import { addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DataSourceError, NotFoundError, NotSingleError } from "logic";
import { characterService, preparePageContext, originService } from "logic/server";
import { IdSchema } from "model";
import { badRequest, serverError } from "navigation";
import { ViewBuilder } from "view/server";
import { createState } from "./actions";
import { PageContent } from "./PageContent";

const InputSchema = z
  .object({
    characterId: IdSchema,
  })
  .required()
  .strict();

type Input = z.infer<typeof InputSchema>;

export default async function Page({ params }: Readonly<{ params: Input }>) {
  const url = `/create/${params.characterId}/origin`;
  const context = await preparePageContext(url, InputSchema, params);

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(({ input }: { input: Input }) => succeed(input)))
    .add(addDataGrouped(originService.retrieveAll))
    .add(addDataGrouped(ViewBuilder.createRaceEntries))
    .add(addDataGrouped(characterService.retrieveOneForUser))
    .add(addDataGrouped(({ character, dataSource }) => createState({ dataSource, character })))
    .runAsync();

  if (!action.success) {
    if (action.error instanceof NotFoundError) {
      console.error(action.error.message);
      return notFound();
    } else if (action.error instanceof NotSingleError) {
      return badRequest();
    } else if (action.error instanceof DataSourceError) {
      return serverError(action.error);
    } else {
      return serverError();
    }
  }

  return <PageContent origins={action.value.originEntries} initialState={action.value.state} />;
}
