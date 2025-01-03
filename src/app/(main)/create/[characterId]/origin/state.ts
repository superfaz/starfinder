import { PromisedResult, addData, addDataGrouped, onSuccessGrouped, start, succeed } from "chain-of-actions";
import { IDataSource } from "data";
import { DataSourceError, NotFoundError } from "logic";
import { abilityScoreService, createTemplater, originService } from "logic/server";
import { AbilityScore, Character, Variant } from "model";
import { RaceView } from "view";
import { ViewBuilder } from "view/server";

export interface State {
  origin?: RaceView;
  variant?: Variant;
  selectableBonus?: AbilityScore;
  selectedTraits: string[];
  options?: unknown;
}

export async function createState(context: {
  dataSource: IDataSource;
  character: Character;
}): PromisedResult<{ state: State }, DataSourceError | NotFoundError> {
  if (!context.character.origin) {
    return succeed({ state: { selectedTraits: [] } });
  }

  let action = start()
    .withContext(context)
    .add(
      onSuccessGrouped(({ character }: { character: Character }) =>
        succeed({
          originId: character.origin,
          variantId: character.variant,
          selectableBonusId: character.originOptions?.selectableBonus,
        })
      )
    )
    .add(addDataGrouped(createTemplater))
    .add(addDataGrouped(originService.retrieveOne))
    .add(addData(ViewBuilder.createOrigin))
    .add(
      addData(() =>
        succeed({ variant: undefined as Variant | undefined, selectableBonus: undefined as AbilityScore | undefined })
      )
    );

  if (context.character.variant !== undefined) {
    action = action.add(addDataGrouped(originService.retrieveVariant));
  }

  if (context.character.originOptions?.selectableBonus !== undefined) {
    action = action
      .add(addDataGrouped(({ selectableBonusId }) => succeed({ abilityScoreId: selectableBonusId! })))
      .add(addDataGrouped(abilityScoreService.retrieveOne))
      .add(addDataGrouped(({ abilityScore }) => succeed({ selectableBonus: abilityScore })));
  }

  return action
    .add(
      onSuccessGrouped(({ originView, variant, character, selectableBonus }) =>
        succeed({
          state: {
            origin: originView,
            variant: variant,
            selectableBonus: selectableBonus,
            selectedTraits: character.traits,
            options: character.originOptions,
          },
        })
      )
    )
    .runAsync();
}
