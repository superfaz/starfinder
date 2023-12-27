import { DataSet, DataSetBuilder } from "data";
import { ClientComponent } from "./client";

export default async function Page() {
  const builder = new DataSetBuilder();
  const data: DataSet = await builder.build();

  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={data} />
    </>
  );
}
