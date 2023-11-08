import { Race } from "../../types";
import { ClientComponent } from "./client";
import Races from "./data.json";

async function getRaces(): Promise<Race[]> {
  return Races;
}

export default async function Page() {
  const races = await getRaces();

  return (
    <>
      <h1>Création de personnage</h1>

      <ClientComponent races={races} />
    </>
  );
}
