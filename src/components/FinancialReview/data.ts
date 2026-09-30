export type VisualVariant = "default" | "alt-blue" | "alt-sage" | "alt-neutral";

export type VisualSize = "standard" | "split" | "data" | "modal";

export interface ActiveImage {
  label: string;
  variant: VisualVariant;
  dimensions: string;
  modalDimensions?: string;
}

export interface ActionLink {
  label: string;
  href?: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  reference: string;
  description: string;
  visuals: ActiveImage[];
  actions?: ActionLink[];
}

export interface QuickLink {
  title: string;
  page: string;
  href: string;
}

export interface DataImageBlock {
  title: string;
  label: string;
  variant: VisualVariant;
  dimensions: string;
}

export interface RatioItem {
  value: string;
  label: string;
}

export interface RatioColumn {
  title: string;
  items: RatioItem[];
}

export const financialSections: ContentSection[] = [
  {
    id: "financial-performance",
    heading: "Financial Performance",
    reference: "Page 165 · Sankey Diagram",
    description:
      "Haycarb delivered a resilient financial performance in 2025/26, navigating a challenging global operating environment to achieve strong revenue growth and sustained profitability.",
    visuals: [{ label: "Income Statement Sankey Diagram", variant: "default", dimensions: "1155 x 435" }],
  },
  {
    id: "segmental-review",
    heading: "Segmental Review and Analysis",
    reference: "Pages 34–37 · 2 Trend Graphs",
    description:
      "Our Segmental Review explores the performance of Haycarb’s key business segments and markets, providing insight into the drivers of growth, challenges encountered, and opportunities pursued during the year. It reflects how our diversified portfolio and global footprint contribute to the Group’s resilience and long-term value creation.",
    visuals: [{ label: "Segment Performance Trend Graphs", variant: "alt-blue", dimensions: "1155 x 435" }],
  },
  {
    id: "financial-position",
    heading: "Financial Position",
    reference: "Pages 164–165 · 2 Graphs",
    description:
      "Haycarb maintained a strong financial position as at 31st March 2026, supported by continued growth in its asset base, strengthened shareholder funds, and sustained profitability. Supported by strategic investments in capacity, innovation, and operational capabilities, Haycarb remains well positioned to support future expansion while maintaining a resilient financial foundation.",
    visuals: [{ label: "Asset Composition + Funding Composition", variant: "alt-sage", dimensions: "1155 x 435" }],
  },
  {
    id: "financial-ratios",
    heading: "Financial Ratios",
    reference: "Pages 166–167 · Du Pont Analysis",
    description:
      "Our key financial ratios provide a snapshot of the Group’s performance, financial strength, and value creation during the year. They help stakeholders evaluate profitability, operational efficiency, financial stability, and long-term growth potential.",
    visuals: [{ label: "Du Pont Analysis", variant: "alt-neutral", dimensions: "1155 x 435" }],
  },
  {
    id: "group-value-addition",
    heading: "Group Value Addition and Distribution",
    reference: "Page 38 · Graphical Illustration",
    description:
      "Our Group Value Addition illustrates how the value generated through our operations is shared among employees, governments, communities, capital providers, and the business itself. It reflects our commitment to creating sustainable economic value while supporting the long-term growth and wellbeing of all stakeholders.",
    visuals: [{ label: "Group Value Addition & Distribution", variant: "default", dimensions: "1155 x 435" }],
  },
];

export const nonFinancialSections: ContentSection[] = [
  {
    id: "esg-governance",
    heading: "ESG Governance",
    reference: "Page 66",
    description:
      "Outlines the structures, roles, and responsibilities in place at Haycarb to oversee and integrate environmental, social, and governance (ESG) priorities into Haycarb’s decision-making - including Board-level oversight, cross-functional ESG teams, and clear accountability mechanisms.",
    visuals: [{ label: "ESG Governance Diagram", variant: "default", dimensions: "1155 x 435" }],
    actions: [{ label: "Download section" }],
  },
  {
    id: "activate-esg",
    heading: "ACTIVATE - ESG Roadmap, ESG Strategies, Metrics and Targets",
    reference: "Existing ACTIVATE treatment",
    description:
      "Haycarb’s ACTIVATE ESG framework - a strategic roadmap built on five key pillars to guide sustainability through 2030 and outlines Haycarb’s approach to managing environmental, social, and governance impacts with measurable goals and performance indicators.",
    visuals: [{ label: "ACTIVATE ESG Roadmap", variant: "alt-blue", dimensions: "1155 x 435" }],
    actions: [
      {
        label: "Download section",
        href: "/pdf/Sustainability-Dashboard/ACTIVATE-2030/ACTIVATE 2030 - Haycarb ESG Roadmap.pdf",
      },
    ],
  },
  {
    id: "slfrs-s1-s2",
    heading:
      "Managing Sustainability and Climate Related Risks and Opportunities - SLFRS S1 and S2 Disclosures",
    reference: "Pages 63–128 · Reference image Page 65",
    description:
      "This section highlights how Haycarb identifies, assesses, and manages sustainability and climate-related risks and opportunities that may influence its strategy, operations, financial performance, and long-term resilience. Aligned with SLFRS S1 and SLFRS S2, it provides a transparent view of the Group's governance, risk management practices, strategic responses, and performance metrics relating to sustainability and climate-related matters.",
    visuals: [{ label: "SLFRS S1 & S2 Disclosure Overview", variant: "alt-sage", dimensions: "1155 x 435" }],
    actions: [
      {
        label: "Download section",
        href: "/pdf/tbc/Managing Climate and Sustainability Related Risks and Opportunities – SLFRS S1 and S2 Disclosures.pdf",
      },
      {
        label: "S1 S2 Assurance Report",
        href: "/pdf/tbc/Assurance Report on SLFRS S1 and S2 Disclosures.pdf",
      },
      { label: "IR and GRI Assurance Report" },
      {
        label: "SDGs & UN Global Compact",
        href: "/pdf/tbc/Our Contribution to the SDGs and UN Global Compact.pdf",
      },
    ],
  },
  {
    id: "climate-action-plan",
    heading: "Climate Action Plan",
    reference: "Pages 181–186",
    description:
      "Haycarb's Climate Action Plan outlines the Group's approach to reducing its environmental impact while strengthening resilience to climate-related risks. Anchored by the ACTIVATE 2030 ESG Roadmap, the plan focuses on decarbonisation, renewable energy adoption, sustainable resource management, climate adaptation, and responsible supply chain practices, supporting the Group's journey towards a more sustainable and climate-resilient future.",
    visuals: [
      { label: "Climate Action Plan Visual 01", variant: "alt-neutral", dimensions: "572 x 415", modalDimensions: "1155 x 435" },
      { label: "Climate Action Plan Visual 02", variant: "default", dimensions: "572 x 415", modalDimensions: "1155 x 435" },
    ],
    actions: [{ label: "Download section" }],
  },
  {
    id: "material-issues",
    heading: "Determining Material Issues",
    reference: "Pages 146–149",
    description:
      "Explains how Haycarb prioritizes the areas that matter most to stakeholders and long-term business success.",
    visuals: [{ label: "Material Issues Visual", variant: "alt-sage", dimensions: "1155 x 435" }],
    actions: [
      {
        label: "Download section",
        href: "/pdf/tbc/Determining Material Topics.pdf",
      },
    ],
  },
  {
    id: "operating-environment",
    heading: "Operating Environment",
    reference: "Pages 131–138",
    description:
      "Summarizes the industry related and external factors - including industry related dynamics, political shifts, economic volatility, climate risks, social expectations, evolving technologies, and regulatory pressures - that influence Haycarb's business decisions and sustainability priorities.",
    visuals: [
      { label: "Porter's Five Forces", variant: "default", dimensions: "572 x 415", modalDimensions: "1155 x 435" },
      { label: "PESTEL", variant: "alt-blue", dimensions: "572 x 415", modalDimensions: "1155 x 435" },
    ],
    actions: [
      {
        label: "Download section",
        href: "/pdf/tbc/Operating Environment.pdf",
      },
    ],
  },
  {
    id: "listening-stakeholders",
    heading: "Listening to Our Stakeholders",
    reference: "Pages 139–145",
    description:
      "Highlights how Haycarb engages with key stakeholder groups - including employees, customers, suppliers, communities, and regulators - to understand their concerns, expectations, and priorities in shaping strategies and responsible decision-making.",
    visuals: [{ label: "Stakeholder Engagement Visual", variant: "alt-neutral", dimensions: "1155 x 435" }],
    actions: [
      {
        label: "Download section",
        href: "/pdf/tbc/Listening to Our Stakeholders.pdf",
      },
    ],
  },
  {
    id: "socio-economic-impact",
    heading: "Our Socio Economic Impact",
    reference: "Pages 42–43",
    description:
      "At Haycarb, we’re committed to creating shared value across our communities. From empowering rural suppliers and supporting smallholder livelihoods to generating local employment and driving community upliftment, our operations contribute to sustainable and inclusive economic growth in every region we serve.",
    visuals: [{ label: "Socio Economic Impact Visual", variant: "default", dimensions: "1155 x 435" }],
    actions: [
      {
        label: "Download section",
        href: "/pdf/tbc/Our Socio-Economic Impact.pdf",
      },
    ],
  },
];

export const quickLinks: QuickLink[] = [
  {
    title: "History of Dividends and Scrip Issues",
    page: "Page 462",
    href: "/pdf/tbc/History of Dividends and Scrip Issues.pdf",
  },
  {
    title: "Ten Year Financial Review",
    page: "Page 454",
    href: "/pdf/tbc/Ten-Year Financial Review.pdf",
  },
  {
    title: "Indicative US Dollar Financial Statements",
    page: "Page 456",
    href: "/pdf/tbc/Indicative US Dollar Financial Statements.pdf",
  },
  {
    title: "Statement of Profit or Loss - Horizontal and Vertical Analysis",
    page: "Page 359",
    href: "/pdf/tbc/Horizontal and Vertical Analysis.pdf",
  },
  {
    title: "Investor Information",
    page: "Page 463",
    href: "/pdf/tbc/Investor Information.pdf",
  },
  {
    title: "Quarterly Analysis",
    page: "Page 468",
    href: "/pdf/tbc/Quarterly Analysis.pdf",
  },
  {
    title: "Country Report",
    page: "Page 474",
    href: "/pdf/tbc/Economic Landscape Country Report.pdf",
  },
  {
    title: "Corporate Information",
    page: "Page 477",
    href: "/pdf/tbc/Corporate Information.pdf",
  },
];

export const financialDataImages: DataImageBlock[] = [
  {
    title: "Financial Performance",
    label: "Financial Performance Image Placement",
    variant: "default",
    dimensions: "1155 x 435",
  },
  {
    title: "Financial Position",
    label: "Financial Position Image Placement",
    variant: "alt-blue",
    dimensions: "1155 x 435",
  },
];

export const financialDataRatios: RatioColumn[] = [
  {
    title: "Profitability highlights",
    items: [
      { value: "12.3", label: "Return on equity (%)" },
      { value: "6.8", label: "Return on Assets (%)" },
      { value: "7.24", label: "Interest cover ratio (No. of times)" },
    ],
  },
  {
    title: "Efficiency ratios",
    items: [
      { value: "1.05", label: "Asset turnover ratio (No. of times)" },
      { value: "58", label: "Debtor Days" },
      { value: "195", label: "Cash conversion cycle (Days)" },
    ],
  },
  {
    title: "Liquidity ratios",
    items: [
      { value: "1.74", label: "Current ratio (No. of times)" },
      { value: "0.8", label: "Quick asset ratio (Times)" },
    ],
  },
  {
    title: "Solvency position",
    items: [
      { value: "60.1", label: "Debt/equity (%)" },
      { value: "37.5", label: "Gearing ratio (%)" },
      { value: "31.4", label: "Debt/Total assets (%)" },
    ],
  },
  {
    title: "Investor position",
    items: [
      { value: "12.18", label: "Earnings per share (Rs)" },
      { value: "33.4", label: "Dividend payout (%)" },
      { value: "98.83", label: "Net asset value per share (Rs)" },
    ],
  },
];
