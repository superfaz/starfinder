import { ClientComponent } from "./client";

async function getRaces() {
  return [
    {
      id: "6a62cb06-21f0-4534-8aaf-15e91fd7d1ed",
      name: "Androïdes",
      description:
        "personnes artificielles composées d’éléments mécaniques, autrefois construites pour en faire des serviteurs mais à présent reconnues comme citoyens à part entière.",
      refs: ["base-42"],
      options: [
        {
          name: "Standard",
          description: "",
          modifiers: { dex: 2, int: 2, cha: -2 },
        },
        {
          name: "Compagnon",
          description:
            "Une niche lucrative avant l’émancipation des androïdes était la construction de compagnons, généralement au sein d’un foyer familial. Ces androïdes ont une personnalité plus évoluée et peuvent avoir un aspect moins artificiel.",
          modifiers: { cha: 2 },
        },
        {
          name: "Ouvrier",
          description:
            "Les androïdes ouvriers ont été créés pour effectuer des tâches ingrates et pour résister aux contraintes spatiales. Dans de nombreuses régions, ils ont été considérés comme la propriété des sociétés pendant beaucoup plus longtemps que les autres androïdes.",
          modifiers: { for: 2, con: 2, cha: -2 },
        },
      ],
    },
    {
      id: "51e8977b-8c8d-4229-9ed1-a7d7e712f7c8",
      name: "Humains",
      description:
        "race extrêmement polyvalente et capable de s’adapter dont les membres n’ont de cesse d’explorer et de se répandre.",
      refs: ["base-44"],
      options: [
        { name: "Standard (Force)", description: "", modifiers: { for: 2 } },
        { name: "Standard (Dextérité)", description: "", modifiers: { dex: 2 } },
        { name: "Standard (Constitution)", description: "", modifiers: { con: 2 } },
        { name: "Standard (Intelligence)", description: "", modifiers: { int: 2 } },
        { name: "Standard (Sagesse)", description: "", modifiers: { sag: 2 } },
        { name: "Standard (Charisme)", description: "", modifiers: { cha: 2 } },
        {
          name: "Graviteur",
          description:
            "Les humains qui se sont adaptés à une forte gravité développent une importante musculature et sont plus trapus. Ils passent plus de temps à lutter contre des conditions difficiles qu’à interagir avec les autres.",
          modifiers: { for: 2, dex: 2, cha: -2 },
        },
        {
          name: "Léger comme une plume",
          description:
            "Les humains nés dans la Diaspora, les stations spatiales, les vaisseaux générationnels ou dans d’autres environnements à faible gravité ou à gravité zéro peuvent parfois se développer de manière différente. Ces humains peuvent être plus grands avec des membres plus longs que la moyenne et une masse musculaire inférieure.",
          modifiers: { dex: 4, for: -2 },
        },
      ],
    },
    {
      id: "84a294e4-18ef-4082-b277-95ef76d689d9",
      name: "Kasathas",
      description:
        "race dotée d’une culture très traditionnelle dont les membres à quatre bras sont originaires d’un monde désertique lointain.",
      refs: ["base-46"],
      options: [
        {
          name: "Standard",
          description: "",
          modifiers: { for: 2, sag: 2, int: -2 },
        },
        {
          name: "Colon akitonien",
          description:
            "À l’origine, les kasathas sont venus dans les Mondes du Pacte pour coloniser Akiton, et certains l’ont fait. Soumis à une gravité moins forte, les colons ont développé une grâce naturelle tout en devenant moins robustes.",
          modifiers: { dex: 2, sag: 2, con: -2 },
        },
        {
          name: "Natif de Kasath",
          description:
            "Certains kasathas qui ont choisi de ne pas quitter Kasath ont survécu pendant des générations dans des conditions difficiles, mais, en privilégiant la survie, leur société a régressé.",
          modifiers: { dex: 2, con: 2, cha: -2 },
        },
        {
          name: "Nomade",
          description:
            "De nombreux kasathas ont quitté Kasath en utilisant d’autres moyens de transport que l’Idari. Ces nomades ont survécu grâce à leur intelligence et à leur charme. Avec le temps, ils sont devenus moins respectueux de leurs traditions.",
          modifiers: { int: 2, cha: 2, sag: -2 },
        },
      ],
    },
    {
      id: "b8086c81-31ba-486b-ada0-d1fb2f867c25",
      name: "Lashuntas",
      description:
        "race d’érudits charismatiques aux pouvoirs télépathiques composée de deux sous-espèces : les membres de la première sont grands et élancés, les autres sont petits et musculeux.",
      refs: ["base-48"],
      options: [
        {
          name: "Korashas",
          description:
            "Les lashuntas korashas ont une puissante musculature, mais ils sont souvent impétueux et peu observateurs.",
          modifiers: { cha: 2, for: 2, sag: -2 },
        },
        {
          name: "Damayas",
          description:
            "Les lashuntas damayas sont généralement très intelligents et éloquents (+2 en Intelligence à la création du personnage), mais quelque peu délicats.",
          modifiers: { cha: 2, for: 2, sag: -2 },
        },
        {
          name: "Korashas - Héritage du chasseur",
          description:
            "Les lignées de l’héritage du chasseur remontent aux légendaires chasseurs lashuntas ayant vécu des siècles avant la Faille. Les lashuntas bénéficiant de cet héritage ont une stature plus robuste et plus fine.",
          modifiers: { for: 2, dex: 2, int: -2 },
        },
        {
          name: "Damayas - Héritage du chasseur",
          description:
            "Les lignées de l’héritage du chasseur remontent aux légendaires chasseurs lashuntas ayant vécu des siècles avant la Faille. Les lashuntas bénéficiant de cet héritage ont une stature plus robuste et plus fine.",
          modifiers: { dex: 2, cha: 2, for: -2 },
        },
        {
          name: "Korashas - Esprit focalisé",
          description:
            "Certains lashuntas ont un organisme favorisant les capacités mentales. Appelés les «esprits focalisés», ces individus ne possèdent pas les modificateurs physiques communs aux autres lashuntas.",
          modifiers: { int: 2, cha: 2, con: -2 },
        },
        {
          name: "Damayas - Esprit focalisé",
          description:
            "Certains lashuntas ont un organisme favorisant les capacités mentales. Appelés les «esprits focalisés», ces individus ne possèdent pas les modificateurs physiques communs aux autres lashuntas.",
          modifiers: { int: 2, sag: 2, cha: 2, con: -4 },
        },
      ],
    },
    {
      id: "5cb35c2a-1a4f-4a68-b60f-ade5b38979aa",
      name: "Shirrens",
      description:
        "race insectoïde semblable aux locustes dont les membres ont quitté leur ruche. Ils ont normalement l’esprit communautaire mais apprécient les choix individuels au point d’y être accro.",
      refs: ["base-50"],
      options: [
        { name: "Standard", description: "", modifiers: { con: 2, sag: 2, cha: -2 } },
        {
          name: "Auxiliaire",
          description:
            "Quand les shirrens servaient l’Essaim, les auxiliaires étaient chargés de s’occuper des chefs de colonie, transmettant les ordres d’un dirigeant et agissant en tant qu’intermédiaires avec les autres entités de l’Essaim. Leur fonction leur épargnait le labeur physique, délégué aux sous-espèces ouvrières. Les auxiliaires shirrens ont une vive intelligence et une compréhension instinctive des dynamiques de pouvoir personnel.",
          modifiers: { int: 2, cha: 2, for: -2 },
        },
        {
          name: "Éclaireur",
          description:
            "Créés à l’origine pour espionner les mondes ciblés par l’Essaim, les éclaireurs shirrens sont aussi rapides pour se déplacer que pour définir des plans et les mettre en application. Ces shirrens ont une stature assez frêle, ce qui les rend moins résistants que les autres membres de leur espèce.",
          modifiers: { dex: 2, int: 2, con: -2 },
        },
        {
          name: "Ouvrier",
          description:
            "Biofabriqués pour travailler, aussi puissants qu’agiles et considérés comme sacrifiables par leurs créateurs de l’Essaim, les ouvriers shirrens sont dotés d’une grande force physique peu commune chez les autres membres de cette espèce. Comme ils étaient sacrifiables, ils sont moins intuitifs et résistants que les autres shirrens.",
          modifiers: { for: 2, dex: 2, cha: -2 },
        },
      ],
    },
    {
      id: "0642b12f-7b6e-4e13-b27b-e595375be9eb",
      name: "Vesks",
      description:
        "race de reptiliens belliqueux qui ont récemment déclaré une trêve avec les autres races – pour le moment.",
      refs: ["base-52"],
      options: [
        {
          name: "Standard",
          description: "",
          modifiers: { for: 2, con: 2, int: -2 },
        },
        {
          name: "Faible gravité",
          description:
            "Au fil des générations, plusieurs groupes de vesks se sont adaptés aux environnements à faible gravité. Les mouvements précis, rapides et calculés sont naturels pour eux, même s’ils ne possèdent pas la puissance physique commune aux autres membres de leur espèce.",
          modifiers: { dex: 2, int: 2, for: -2 },
        },
        {
          name: "Psychovenimeux",
          description:
            "En de rares occasions, les vesks peuvent donner naissance à un enfant psychique. Selon la légende, un peuple de serpents vivant dans les cavernes de Vesk Prime a modifié des vesks au cours de rituels surnaturels, permettant à ceux qui ont hérité de ces gènes altérés d’attaquer avec leurs «pensées venimeuses». Plus frêles que des vesks normaux, les psychovenimeux ont une personnalité forte et une puissante volonté.",
          modifiers: { sag: 2, cha: 2, con: -2 },
        },
        {
          name: "Sang de guerre",
          description:
            "Les lignées de certains vesks sont réputées pour avoir engendré des guerriers féroces. Dans la plupart des cas, cela est dû à une altération génétique qui leur confère des muscles plus puissants, des pointes osseuses plus longues et une crête d’épines tout le long de leur colonne vertébrale. Ils sont aussi plus agressifs, et comme ils ont tendance à tout voir sous le prisme du conflit, ceux qui les côtoient ont souvent du mal à leur faire confiance.",
          modifiers: { for: 2, dex: 2, cha: -2 },
        },
      ],
    },
    {
      id: "d65139e8-39ce-4b4c-85f8-0338e8782477",
      name: "Ysokis",
      description:
        "également appelés « hommes-rats », ces petits récupérateurs recouverts de fourrure compensent leur petite taille par une personnalité affirmée.",
      refs: ["base-54"],
      options: [
        { name: "Standard", description: "", modifiers: { dex: 2, int: 2, for: -2 } },
        {
          name: "Anthropomorphique",
          description:
            "La plupart des ysokis ont des traits d’animaux, tels que des pattes digitigrades et des membres de même taille. Certains, cependant, ont une anatomie plus proche de celle des humains, avec des pieds plantigrades et des jambes plus longues que les bras. Ces ysokis ont probablement des ancêtres venant d’au-delà des Mondes du Pacte, mais il n’existe aucun consensus scientifique sur cette question.",
          modifiers: { int: 2, cha: 2, for: -2 },
        },
        {
          name: "0-grav",
          description:
            "Les ysokis qui vivent dans un environnement à faible gravité ont des corps plus longs et plus maigres. Connus collectivement sous le nom d’ysokis 0-grav, ces individus sont capables d’incroyables exploits d’agilité, mais leurs os sont notoirement fragiles.",
          modifiers: { dex: 4, con: -2 },
        },
        {
          name: "Survivant",
          description:
            "Bien que certains estiment que les ysokis sont faibles, ce sont des récupérateurs et des survivants, et dans bon nombre de leurs cultures, ces traits sont plus appréciés que le bricolage ou des activités similaires. Un exemple célèbre d’ysokis survivants sont ceux que l’on trouve sur la Station Absalom et qui auraient pour origine le monde perdu de Golarion.",
          modifiers: { con: 2 },
        },
      ],
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
