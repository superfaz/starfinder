import { Node, PromisedResult, addData, addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { z } from "zod";
import { IPageContext, characterService, preparePageContext, raceService } from "logic/server";
import { Character, IdSchema } from "model";
import { createState } from "./state";
import { DataSourceError, NotFoundError, NotSingleError, UnauthorizedError } from "logic";
import { notFound } from "next/navigation";
import { badRequest, serverError, unauthorized } from "navigation";
import { PageContent } from "./PageContent";
import { log } from "app/helpers-server";

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
    .add(addDataGrouped(({ viewBuilder, races }) => viewBuilder.createRaceEntries(races)))
    .add(addDataGrouped(characterService.retrieveOneForUser))
    .add(addData(({ character }, { dataSource }) => createState({ dataSource, character })))
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
