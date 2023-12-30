import { DataSetBuilder, IClientDataSet, IDataSet } from "data";
import { ClientComponent } from "./client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const builder = new DataSetBuilder();
  const serverData: IDataSet = await builder.build();
  const clientData: IClientDataSet = {
    abilityScores: await serverData.getAbilityScores(),
    alignments: await serverData.getAlignments(),
    armors: await serverData.getArmors(),
    avatars: await serverData.getAvatars(),
    classes: await serverData.getClasses(),
    races: await serverData.getRaces(),
    skills: await serverData.getSkills(),
    themes: await serverData.getThemes(),
    weapons: await serverData.getWeapons(),
  };
  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={clientData} />
    </>
  );
}
