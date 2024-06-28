import { Metadata } from "next";
import { secure } from "../helpers";
import { PageContent } from "./PageContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Debug",
};

export default secure(<PageContent />, "/create/debug");
