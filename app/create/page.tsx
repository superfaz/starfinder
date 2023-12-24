import { DataSet, buildDataSet } from "data";
import { ClientComponent } from "./client";

export default function Page() {
  const data: DataSet = buildDataSet();

  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={data} />
    </>
  );
}
