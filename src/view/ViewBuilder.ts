import { IDataSource } from "data";
import { createCharacter } from "./CharacterView";

export class ViewBuilder {
  private _dataSource: IDataSource;

  constructor(dataSource: IDataSource) {
    this._dataSource = dataSource;
  }

  public get dataSource(): IDataSource {
    return this._dataSource;
  }

  public createCharacter = createCharacter;
}
