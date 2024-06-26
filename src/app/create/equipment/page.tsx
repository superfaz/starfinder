import { Metadata } from "next";
import { EquipmentSelection } from "./EquipmentSelection";

export const metadata: Metadata = {
  title: "Sélection de l'équipement",
};

export default function Page() {
  return <EquipmentSelection />;
}
