import { DataSource, IDataSource } from "data";
import { createCharacterDetailed } from "./CharacterDetailedView";
import { createCharacter } from "./CharacterView";
import { createEntry } from "./EntryView";
import { createRace, createRaceEntries } from "./RaceView";
import { Character } from "model";
import { CharacterView } from "view/interfaces";

export class ViewBuilder {
  private _dataSource: IDataSource;

  constructor(dataSource?: IDataSource) {
    this._dataSource = dataSource ?? new DataSource();
  }

  public get dataSource(): IDataSource {
    return this._dataSource;
  }

  static createRace = createRace;

  public createCharacter(characters: Character[]): Promise<CharacterView[]>;
  public createCharacter(characters: Character): Promise<CharacterView>;
  public createCharacter(characters: Character | Character[]): Promise<CharacterView | CharacterView[]> {
    if (Array.isArray(characters)) {
      return Promise.all(characters.map((c) => createCharacter.bind(this)(c)));
    }

    return createCharacter.bind(this)(characters);
  }

  public createCharacterDetailed = createCharacterDetailed.bind(this);
  public createEntry = createEntry.bind(this);
  public createRaceEntries = createRaceEntries.bind(this);
}
