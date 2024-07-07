import { Metadata } from "next";
import { secure } from "../helpers-server";
import { EquipmentSelection } from "./EquipmentSelection";

export const metadata: Metadata = {
  title: "Sélection de l'équipement",
};

export default secure(<EquipmentSelection />, "/create/equipment");
