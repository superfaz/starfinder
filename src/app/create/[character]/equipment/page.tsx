import { Metadata } from "next";
import { isSecure } from "../helpers-server";
import { EquipmentSelection } from "./EquipmentSelection";

export const metadata: Metadata = {
  title: "Sélection de l'équipement",
};
export default async function Page({ params }: { params: { character: string } }) {
  const characterId = params.character;
  const returnTo = `/create/${characterId}/equipment`;

  if (await isSecure(returnTo)) {
    return <EquipmentSelection />;
  }
}
