import { Metadata } from "next";
import { secure } from "../helpers-server";
import { PageContent } from "./PageContent";

export const metadata: Metadata = {
  title: "Définition du profil",
};

export default secure(<PageContent />, "/create/profile");
