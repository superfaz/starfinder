import { Metadata } from "next";
import { isSecure } from "app/helpers-server";
import { EquipmentSelection } from "./EquipmentSelection";

export const metadata: Metadata = {
  title: "Sélection de l'équipement",
};
export default async function Page({ params }: Readonly<{ params: { character: string } }>) {
  const characterId = params.character;
  const returnTo = `/edit/${characterId}/equipment`;

  if (await isSecure(returnTo)) {
    return <EquipmentSelection />;
  }
}
