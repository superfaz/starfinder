import { PromisedResult, addData, addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError } from "logic";
import { abilityScoreService, createTemplater, raceService } from "logic/server";
import { AbilityScore, Character, Variant } from "model";
import { RaceView } from "view";
import { ViewBuilder } from "view/server";

export interface State {
  race?: RaceView;
  variant?: Variant;
  selectableBonus?: AbilityScore;
  options?: unknown;
  selectedTraits: string[];
}

export async function createState(context: {
  dataSource: IDataSource;
  character: Character;
}): PromisedResult<{ state: State }, DataSourceError | NotFoundError> {
  if (!context.character.race) {
    return succeed({ state: { selectedTraits: [] } });
  }

  let action = start()
    .withContext(context)
    .add(
      onSuccessGrouped(({ character }: { character: Character }) =>
        succeed({
          raceId: character.race,
          variantId: character.raceVariant,
          selectableBonusId: character.raceOptions?.selectableBonus,
        })
      )
    )
    .add(addDataGrouped(createTemplater))
    .add(addDataGrouped(raceService.retrieveOne))
    .add(addData(ViewBuilder.createRace))
    .add(
      addData(() =>
        succeed({ variant: undefined as Variant | undefined, selectableBonus: undefined as AbilityScore | undefined })
      )
    );

  if (context.character.raceVariant !== undefined) {
    action = action.add(addDataGrouped(raceService.retrieveVariant));
  }

  if (context.character.raceOptions?.selectableBonus !== undefined) {
    action = action
      .add(addDataGrouped(({ selectableBonusId }) => succeed({ abilityScoreId: selectableBonusId! })))
      .add(addDataGrouped(abilityScoreService.retrieveOne))
      .add(addDataGrouped(({ abilityScore }) => succeed({ selectableBonus: abilityScore })));
  }

  return action
    .add(
      onSuccessGrouped(({ raceView, variant, character, selectableBonus }) =>
        succeed({
          state: {
            race: raceView,
            variant: variant,
            selectableBonus: selectableBonus,
            options: character.raceOptions,
            selectedTraits: character.traits,
          },
        })
      )
    )
    .runAsync();
}
