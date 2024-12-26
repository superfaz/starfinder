import { addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DataSourceError, NotFoundError, NotSingleError } from "logic";
import { characterService, preparePageContext, raceService } from "logic/server";
import { IdSchema } from "model";
import { badRequest, serverError } from "navigation";
import { ViewBuilder } from "view/server";
import { PageContent } from "./PageContent";
import { createState } from "./state";

const InputSchema = z
  .object({
    characterId: IdSchema,
  })
  .required()
  .strict();

type Input = z.infer<typeof InputSchema>;

export default async function Page({ params }: Readonly<{ params: Input }>) {
  const url = `/create/${params.characterId}/race`;
  const context = await preparePageContext(url, InputSchema, params);

  const action = await start()
    .withContext(context.value)
    .add(onSuccessGrouped(({ input }: { input: Input }) => succeed(input)))
    .add(addDataGrouped(raceService.retrieveAll))
    .add(addDataGrouped(ViewBuilder.createRaceEntries))
    .add(addDataGrouped(characterService.retrieveOneForUser))
    .add(addDataGrouped(({ character, dataSource }) => createState({ dataSource, character })))
    .runAsync();

  if (!action.success) {
    if (action.error instanceof NotFoundError) {
      return notFound();
    } else if (action.error instanceof NotSingleError) {
      return badRequest();
    } else if (action.error instanceof DataSourceError) {
      return serverError(action.error);
    } else {
      return serverError();
    }
  }

  return <PageContent races={action.value.raceEntries} initialState={action.value.state} />;
}
