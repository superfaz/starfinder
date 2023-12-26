import { IModel } from ".";

export interface Avatar extends IModel {
  id: string;
  image: string;
  tags: string[];
}
