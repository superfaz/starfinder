import { DataSource, IDataSource } from "data";
import { createCharacter } from "./CharacterView";
import { createEntry } from "./EntryView";
import { createRaceEntry } from "./RaceView";

export class ViewBuilder {
  private _dataSource: IDataSource;

  constructor(dataSource?: IDataSource) {
    this._dataSource = dataSource ?? new DataSource();
  }

  public get dataSource(): IDataSource {
    return this._dataSource;
  }

  public createCharacter = createCharacter;
  public createEntry = createEntry;
  public createRaceEntry = createRaceEntry;
}
