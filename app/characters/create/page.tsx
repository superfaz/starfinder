import { Card, CardBody, CardText, CardTitle, Col, Row } from "react-bootstrap";
import { ClientComponent } from "./client";

async function getRaces() {
  return [
    {
      id: "6a62cb06-21f0-4534-8aaf-15e91fd7d1ed",
      name: "Androïdes",
      description:
        "personnes artificielles composées d’éléments mécaniques, autrefois construites pour en faire des serviteurs mais à présent reconnues comme citoyens à part entière.",
      refs: ["base-42"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "51e8977b-8c8d-4229-9ed1-a7d7e712f7c8",
      name: "Humains",
      description:
        "race extrêmement polyvalente et capable de s’adapter dont les membres n’ont de cesse d’explorer et de se répandre.",
      refs: ["base-44"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "84a294e4-18ef-4082-b277-95ef76d689d9",
      name: "Kasathas",
      description:
        "race dotée d’une culture très traditionnelle dont les membres à quatre bras sont originaires d’un monde désertique lointain.",
      refs: ["base-46"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "b8086c81-31ba-486b-ada0-d1fb2f867c25",
      name: "Lashuntas",
      description:
        "race d’érudits charismatiques aux pouvoirs télépathiques composée de deux sous-espèces : les membres de la première sont grands et élancés, les autres sont petits et musculeux.",
      refs: ["base-48"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "5cb35c2a-1a4f-4a68-b60f-ade5b38979aa",
      name: "Shirrens",
      description:
        "race insectoïde semblable aux locustes dont les membres ont quitté leur ruche. Ils ont normalement l’esprit communautaire mais apprécient les choix individuels au point d’y être accro.",
      refs: ["base-50"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "0642b12f-7b6e-4e13-b27b-e595375be9eb",
      name: "Vesks",
      description:
        "race de reptiliens belliqueux qui ont récemment déclaré une trêve avec les autres races – pour le moment.",
      refs: ["base-52"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
    {
      id: "d65139e8-39ce-4b4c-85f8-0338e8782477",
      name: "Ysokis",
      description:
        "également appelés « hommes-rats », ces petits récupérateurs recouverts de fourrure compensent leur petite taille par une personnalité affirmée.",
      refs: ["base-54"],
      options: [{ name: "", description: "", modifiers: {} }],
    },
  ];
}

export default async function Page() {
  const races = await getRaces();

  return (
    <>
      <h1>Créer un personnage</h1>

      <ClientComponent races={races} />
    </>
  );
}
