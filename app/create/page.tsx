import { IDataSet, DataSetBuilder } from "data";
import { ClientComponent } from "./client";

export default async function Page() {
  const builder = new DataSetBuilder();
  const data: IDataSet = await builder.build();

  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={data} />
    </>
  );
}
