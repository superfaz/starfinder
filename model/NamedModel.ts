import { IModel } from ".";

export interface NamedModel extends IModel {
  id: string;
  name: string;
}
