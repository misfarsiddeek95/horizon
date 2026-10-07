import { createElement, type ReactNode } from "react";

export type IconNode =
  | { tag: "path"; d: string }
  | { tag: "circle"; cx: number; cy: number; r: number }
  | { tag: "ellipse"; cx: number; cy: number; rx: number; ry: number }
  | { tag: "rect"; x: number; y: number; width: number; height: number; rx?: number };

export interface IconDef {
  viewBox: string;
  nodes: IconNode[];
}

export function renderIconNodes(nodes: readonly IconNode[]): ReactNode {
  return nodes.map((node, index) => {
    const { tag, ...props } = node;
    return createElement(tag, { ...props, key: index });
  });
}

export const VCC_STAGE_IDS = [
  "inputs",
  "strategy",
  "transformation",
  "outputs",
  "outcomes",
] as const;

export type StageId = (typeof VCC_STAGE_IDS)[number];

export interface Stage {
  id: StageId;
  label: string;
  tabSubtitle: string;
  color: string;
  tabIcon: IconDef;
  description: string;
  badge: string;
}

export const STAGES: Record<StageId, Stage> = {
  inputs: {
    id: "inputs",
    label: "Inputs",
    tabSubtitle: "Seven capitals that support the business.",
    color: "#2f9ea2",
    tabIcon: {
      viewBox: "0 0 120 120",
      nodes: [
        { tag: "circle", cx: 38, cy: 38, r: 16 },
        { tag: "circle", cx: 82, cy: 38, r: 16 },
        { tag: "circle", cx: 38, cy: 82, r: 16 },
        { tag: "circle", cx: 82, cy: 82, r: 16 },
        { tag: "path", d: "M38 54v12M82 54v12M54 38h12M54 82h12" },
      ],
    },
    description:
      "Haycarb’s model starts with seven capitals. This version uses larger, more visual tiles so the information feels more like an infographic than a report page.",
    badge: "7 Capitals",
  },
  strategy: {
    id: "strategy",
    label: "Strategy",
    tabSubtitle: "Growth, supply chain, innovation and people.",
    color: "#ee7e45",
    tabIcon: {
      viewBox: "0 0 120 120",
      nodes: [
        { tag: "circle", cx: 60, cy: 60, r: 38 },
        { tag: "circle", cx: 60, cy: 60, r: 24 },
        { tag: "circle", cx: 60, cy: 60, r: 8 },
        { tag: "path", d: "M82 38l20-20M87 18h15v15" },
      ],
    },
    description:
      "A more visual snapshot of the four strategic focus areas, supported by governance, risk management and an ESG mindset.",
    badge: "4 Strategic Pillars",
  },
  transformation: {
    id: "transformation",
    label: "Transformation",
    tabSubtitle: "How operations convert inputs into solutions.",
    color: "#d9ad35",
    tabIcon: {
      viewBox: "0 0 120 120",
      nodes: [
        { tag: "circle", cx: 46, cy: 60, r: 22 },
        { tag: "circle", cx: 46, cy: 60, r: 8 },
        { tag: "circle", cx: 82, cy: 72, r: 16 },
        { tag: "circle", cx: 82, cy: 72, r: 6 },
        {
          tag: "path",
          d: "M46 27v10M46 83v10M13 60h10M69 60h10M23 37l7 7M62 76l7 7M23 83l7-7M62 44l7-7",
        },
        {
          tag: "path",
          d: "M82 48v8M82 88v8M58 72h8M98 72h8M65 55l6 6M93 83l6 6M65 89l6-6M93 61l6-6",
        },
      ],
    },
    description:
      "The model becomes more visual here through two process tracks — one for Activated Carbon Solutions and one for Environmental Engineering Solutions.",
    badge: "2 Core Pathways",
  },
  outputs: {
    id: "outputs",
    label: "Outputs & Impacts",
    tabSubtitle: "Products, services and environmental measures.",
    color: "#8abc46",
    tabIcon: {
      viewBox: "0 0 120 120",
      nodes: [
        { tag: "rect", x: 18, y: 52, width: 48, height: 42, rx: 8 },
        { tag: "path", d: "M18 58l24 14 24-14M42 72v22" },
        {
          tag: "path",
          d: "M78 82c18-2 28-14 24-34-20 0-32 10-34 28 0 0 4 6 10 6z",
        },
        { tag: "path", d: "M74 80c8-10 15-17 26-24" },
      ],
    },
    description:
      "This section uses bigger metric cards and a side impact panel to make the data feel more visual and easier to scan.",
    badge: "Key Measures",
  },
  outcomes: {
    id: "outcomes",
    label: "Outcomes",
    tabSubtitle: "Value delivered to capitals, communities and planet.",
    color: "#9a6fc0",
    tabIcon: {
      viewBox: "0 0 120 120",
      nodes: [
        { tag: "circle", cx: 60, cy: 52, r: 34 },
        {
          tag: "path",
          d: "M30 42c10 2 18 2 28-2 8-3 15-8 24-10M42 78c5-9 12-14 22-17 10-3 19-2 28 2",
        },
        {
          tag: "path",
          d: "M60 86v18M60 98c-10-1-18-6-24-14M60 98c10-1 18-6 24-14",
        },
        { tag: "path", d: "M30 52h60" },
      ],
    },
    description:
      "The outcomes view groups value by capital and highlights the three broader themes for communities and the planet.",
    badge: "Long-term Value",
  },
};

export interface ValueCreationCopy {
  kicker: string;
  title: string;
  intro: string;
  hint: string;
}

export const VALUE_CREATION_COPY: ValueCreationCopy = {
  kicker: "Value Creation",
  title: "Our Value Creation Model",
  intro:
    "Explore how Haycarb brings together its capitals, strategy and transformation processes to create outputs, impacts and long-term outcomes.",
  hint: "Use the stages below to move through the value creation journey.",
};

export interface ValueCreationImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const VALUE_CREATION_IMAGES: Record<"illustration" | "wheel", ValueCreationImage> = {
  illustration: {
    src: "/images/value-creation/value-creation-illustration.png",
    alt: "Value creation illustration",
    width: 508,
    height: 250,
  },
  wheel: {
    src: "/images/value-creation/value-creation-wheel.png",
    alt: "Value Creation at a Glance",
    width: 790,
    height: 750,
  },
};

export interface CapitalStat {
  label: string;
  value: string;
}

export interface Capital {
  title: string;
  description: string;
  icon: IconDef;
  background: string;
  iconBackground: string;
  stats: CapitalStat[];
}

export const CAPITALS: Capital[] = [
  {
    title: "Financial Capital",
    description: "Resources that underpin value creation.",
    background: "#dff2ef",
    iconBackground: "#2c9596",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "ellipse", cx: 9, cy: 7, rx: 5, ry: 2.5 },
        { tag: "path", d: "M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" },
        { tag: "path", d: "M4 11v4c0 1.4 2.2 2.5 5 2.5 1 0 1.9-.1 2.7-.4" },
        { tag: "circle", cx: 17.5, cy: 15.5, r: 3.5 },
        {
          tag: "path",
          d: "M17.5 13.7v3.6M16.4 14.4h1.7c.7 0 1.2.4 1.2.9s-.5.9-1.2.9h-1.2c-.7 0-1.2.4-1.2.9s.5.9 1.2.9h1.7",
        },
      ],
    },
    stats: [
      { label: "Shareholders’ funds", value: "Rs. 29.37 Bn" },
      { label: "Debt capital", value: "Rs. 20.05 Bn" },
    ],
  },
  {
    title: "Natural Capital",
    description: "Renewable raw material, water and energy inputs.",
    background: "#e9f5da",
    iconBackground: "#8fbe49",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        {
          tag: "path",
          d: "M20 4C12 4 6.5 7.4 5 13.2c-.8 3.2 1.4 5.8 4.6 5.8C15.7 19 19.1 12.9 20 4z",
        },
        { tag: "path", d: "M5 20c2.7-4.8 6.4-8.1 11.4-10" },
      ],
    },
    stats: [
      { label: "Raw material", value: "178,496 MT" },
      { label: "Water", value: "791,147 m³" },
      { label: "Energy", value: "1,237,238 GJ" },
    ],
  },
  {
    title: "Social & Relationship",
    description: "Customers, suppliers and stakeholder relationships.",
    background: "#fbf2d9",
    iconBackground: "#deb447",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "circle", cx: 12, cy: 8, r: 3 },
        { tag: "circle", cx: 5.5, cy: 10, r: 2.2 },
        { tag: "circle", cx: 18.5, cy: 10, r: 2.2 },
        { tag: "path", d: "M7 19c.4-3.3 2.1-5 5-5s4.6 1.7 5 5" },
        {
          tag: "path",
          d: "M2.5 18c.2-2.4 1.3-3.7 3.3-3.7 1 0 1.8.3 2.4.8M21.5 18c-.2-2.4-1.3-3.7-3.3-3.7-1 0-1.8.3-2.4.8",
        },
      ],
    },
    stats: [
      { label: "Customers", value: ">600" },
      { label: "Suppliers", value: ">500" },
      { label: "CSR", value: "Rs. 52.7 Mn" },
    ],
  },
  {
    title: "Intellectual Capital",
    description: "R&D capability, certifications and technical know-how.",
    background: "#efe6f7",
    iconBackground: "#9c72b9",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "path", d: "M9 18h6" },
        { tag: "path", d: "M10 21h4" },
        {
          tag: "path",
          d: "M8.2 14.5A6 6 0 1 1 15.8 14.5c-1 .8-1.6 1.8-1.8 2.5h-4c-.2-.8-.8-1.7-1.8-2.5z",
        },
        { tag: "path", d: "M12 3v2M4.9 6l1.4 1.4M19.1 6l-1.4 1.4" },
      ],
    },
    stats: [
      { label: "R&D", value: "Rs. 261 Mn" },
      { label: "Certifications", value: "32" },
    ],
  },
  {
    title: "Human Capital",
    description: "A skilled, innovation-focused workforce.",
    background: "#fde8ea",
    iconBackground: "#e6646c",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "circle", cx: 12, cy: 7.5, r: 3.5 },
        { tag: "path", d: "M5 20c.6-4.2 2.9-6.4 7-6.4s6.4 2.2 7 6.4" },
        { tag: "path", d: "M9 17h6" },
      ],
    },
    stats: [
      { label: "Employees", value: "2,084" },
      { label: "Across", value: "8 countries" },
    ],
  },
  {
    title: "Digital Capital",
    description: "Platforms, systems and marketing technology.",
    background: "#fce9dd",
    iconBackground: "#e67f45",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "rect", x: 3, y: 4, width: 18, height: 12, rx: 2 },
        { tag: "path", d: "M8 20h8M12 16v4" },
        { tag: "circle", cx: 8, cy: 10, r: 1.5 },
        { tag: "circle", cx: 16, cy: 8, r: 1.5 },
        { tag: "circle", cx: 16, cy: 13, r: 1.5 },
        { tag: "path", d: "M9.5 9.6l5-1.2M9.5 10.7l5 1.8" },
      ],
    },
    stats: [
      { label: "Systems", value: "Rs. 70.5 Mn" },
      { label: "Marketing", value: "Rs. 11.69 Mn" },
    ],
  },
  {
    title: "Manufactured Capital",
    description: "Physical footprint and operational infrastructure.",
    background: "#f4ebe4",
    iconBackground: "#b28870",
    icon: {
      viewBox: "0 0 24 24",
      nodes: [
        { tag: "path", d: "M3 20V9l6 3V8l6 4V6l6 4v10H3z" },
        { tag: "path", d: "M7 16h2M12 16h2M17 16h2" },
        { tag: "path", d: "M5 20v-3M19 20v-3" },
      ],
    },
    stats: [
      { label: "Plants", value: "7 across 3 countries" },
      { label: "PPE", value: "Rs. 16.17 Bn" },
      { label: "Capex", value: "Rs. 4.15 Bn" },
    ],
  },
];

export interface StrategyPillar {
  number: string;
  title: string;
  text: string;
}

export const STRATEGY_PILLARS: StrategyPillar[] = [
  {
    number: "01",
    title: "Market growth",
    text: "Grow Haycarb’s presence by capturing more demand across its markets and applications.",
  },
  {
    number: "02",
    title: "Strengthen global supply chains",
    text: "Support continuity, resilience and reach across sourcing, manufacturing and delivery.",
  },
  {
    number: "03",
    title: "Innovation-led growth",
    text: "Use R&D, product development and technical capability to create new value.",
  },
  {
    number: "04",
    title: "Purpose-driven teams",
    text: "Strengthen people capability and shared commitment around long-term business value.",
  },
];

export const STRATEGY_RIBBON = {
  title: "Governance + Risk Management",
  detail:
    "Operating context • Material topics • Climate-related and sustainability-related risks & opportunities",
};

export interface TransformationTrack {
  id: "activated-carbon" | "environmental-engineering";
  title: string;
  steps: string[];
}

export const TRANSFORMATION_TRACKS: TransformationTrack[] = [
  {
    id: "activated-carbon",
    title: "Activated Carbon Solutions",
    steps: [
      "Understand customer needs",
      "Research & development",
      "Source raw materials",
      "Manufacture activated carbon",
      "Ensure product quality",
      "Distribute to customers",
    ],
  },
  {
    id: "environmental-engineering",
    title: "Environmental Engineering Solutions",
    steps: [
      "Understand customer needs",
      "Design solutions",
      "Commissioning & quality assurance",
      "O&M support",
    ],
  },
];

export interface OutputMetric {
  label: string;
  value: string;
  text: string;
}

export const OUTPUT_METRICS: OutputMetric[] = [
  {
    label: "Output",
    value: "53,200 MT",
    text: "Activated carbon produced.",
  },
  {
    label: "Output",
    value: "Water + Wastewater",
    text: "Treatment and purification solutions delivered.",
  },
  {
    label: "Output",
    value: "Product Portfolio",
    text: "An array of activated carbon products for multiple industries.",
  },
];

export const ENVIRONMENTAL_IMPACTS = [
  { value: "49,785 tCO₂e", label: "Carbon footprint" },
  { value: "5,042 MT", label: "Waste generated" },
  { value: "360,699 m³", label: "Effluents" },
];

export const OUTCOMES = [
  {
    title: "Financial",
    text: "EPS Rs. 12.18 • ROE 12.3% • Dividend per share Rs. 4.07",
  },
  {
    title: "Natural",
    text: "61% sustainably sourced charcoal • 16% sustainable water sourcing",
  },
  {
    title: "Social & Relationship",
    text: ">90% customer satisfaction • 19 new customers • 104 new suppliers • >135,000 CSR beneficiaries",
  },
  {
    title: "Intellectual",
    text: "14 new products • 1,500+ activated carbon products • 100+ environmental engineering solutions",
  },
  {
    title: "Human",
    text: "85.3% employee retention • 31.1 training hours per employee",
  },
  {
    title: "Digital & Manufactured",
    text: "Digitalisation initiatives plus investment in energy storage and value-added carbon manufacturing.",
  },
];

export const PLANET_FOCUS = [
  {
    title: "Sustainable water management",
    text: "Water and wastewater treatment solutions that enable recycling and reuse.",
  },
  {
    title: "Safeguarding wellbeing",
    text: "Water purification and contaminant removal solutions that support healthier outcomes.",
  },
  {
    title: "Industrial sustainability",
    text: "Solutions that support resource efficiency, chemical recovery and reuse.",
  },
];
