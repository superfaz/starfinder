import { IModel } from ".";

export interface CodedModel extends IModel {
  id: string;
  code: string;
  name: string;
}
