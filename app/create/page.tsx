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
    feats: await serverData.getFeats(),
    races: await serverData.getRaces(),
    savingThrows: await serverData.getSavingThrows(),
    skills: await serverData.getSkills(),
    spells: await serverData.getSpells(),
    themes: await serverData.getThemes(),
    weapons: await serverData.getWeapons(),
    professions: await serverData.getProfessions(),
  };
  return (
    <>
      <h1>Création de personnage</h1>
      <ClientComponent data={clientData} />
    </>
  );
}
