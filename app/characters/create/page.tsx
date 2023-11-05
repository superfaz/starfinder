import { ClientComponent } from "./client";
import Races from "./data.json";

async function getRaces() {
  return Races;
}

export default async function Page() {
  const races = await getRaces();

  return (
    <>
      <h1>Créer un personnage</h1>

      <ClientComponent races={races} />
    </>
  );
}
