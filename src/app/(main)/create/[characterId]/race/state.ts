import { PromisedResult, addData, addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError } from "logic";
import { raceService } from "logic/server";
import { Character, Variant } from "model";
import { RaceView } from "view";
import { ViewBuilder } from "view/server";

export interface State {
  race?: RaceView;
  variant?: Variant;
  options?: unknown;
}

export async function createState(context: {
  dataSource: IDataSource;
  character: Character;
}): PromisedResult<{ state: State }, DataSourceError | NotFoundError> {
  if (!context.character.race) {
    return succeed({ state: {} });
  }

  const race = start()
    .withContext(context)
    .add(onSuccessGrouped(({ character }: { character: Character }) => succeed({ raceId: character.race })))
    .add(addDataGrouped(raceService.retrieveOne))
    .add(addData(ViewBuilder.createRace));

  if (context.character.raceVariant === undefined) {
    return race
      .add(
        onSuccessGrouped(({ raceView, character }) =>
          succeed({ state: { race: raceView, options: character.raceOptions } })
        )
      )
      .runAsync();
  } else {
    return race
      .add(addDataGrouped(({ character }) => succeed({ variantId: character.raceVariant })))
      .add(addDataGrouped(raceService.retrieveVariant))
      .add(
        onSuccessGrouped(({ raceView, variant, character }) =>
          succeed({ state: { race: raceView, variant: variant, options: character.raceOptions } })
        )
      )
      .runAsync();
  }
}
