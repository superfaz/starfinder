import { Metadata } from "next";
import { secure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Sélection de la classe",
};

export default secure(<PageContent />, "/create/class");
