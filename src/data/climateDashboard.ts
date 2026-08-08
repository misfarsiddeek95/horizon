export interface CrroDriverData {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  values: { h: string; low: number; high: number }[];
  note: string;
}

export interface CrroFinancialItem {
  title: string;
  subtitle: string;
  axis: string;
  unit: string;
  format: "percent" | "number" | "multiple";
  values: { h: string; low: number; high: number }[];
  note: string;
}

export interface CrroData {
  id: string;
  shortName: string;
  name: string;
  classification: "Risk" | "Opportunity";
  color: string;
  light: string;
  iconSvg: string;
  description: string;
  keyDriver: string;
  keyFinancial: string;
  driver: CrroDriverData;
  financial: CrroFinancialItem[];
}

export const CRROS: CrroData[] = [
  {
    id: "CRRO 1",
    shortName: "Raw material supply",
    name: "Climate Risk to Raw Material Supply",
    classification: "Risk",
    color: "#174A7E",
    light: "#DCEBFA",
    iconSvg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15c0-5.2 4.1-9.3 9.3-9.3 1.3 0 2.5.2 3.7.7-.3 5.6-4.8 10.1-10.4 10.4-.5-1.2-.8-2.4-.8-3.8Z"></path><path d="M8.2 14.8c2.5-.5 4.7-2.3 6.4-5"></path><path d="M12.4 10.7c.6 1.3 1.8 2.4 3.3 3"></path></svg>`,
    description: "Climate risk to raw material supply, covering coconut shell and coconut shell charcoal.",
    keyDriver: "Coconut shell charcoal cost pressure",
    keyFinancial: "Incremental raw material cost",
    driver: {
      title: "Estimated Average Coconut Shell Charcoal Cost Increase Across Major Sourcing Regions",
      subtitle: "Compared with the FY 2025/26 baseline",
      axis: "CSC cost increase from baseline",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 20, high: 30 },
        { h: "MT", low: 55, high: 88 },
        { h: "LT", low: 108, high: 160 },
      ],
      note: "The estimates represent the combined average increase in coconut shell charcoal costs across Sri Lanka, India, Indonesia and Thailand. The ranges reflect increasing supply pressure from climate variability, higher production demand, tightening coconut-shell availability and greater reliance on higher-cost sourcing channels.",
    },
    financial: [
      {
        title: "Estimated Incremental Raw Material Cost Increase",
        subtitle: "Compared with FY 2025/26 raw material costs",
        axis: "Incremental raw material cost",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 5.5, high: 8.3 },
          { h: "MT", low: 14.3, high: 22.8 },
          { h: "LT", low: 29.2, high: 43.9 },
        ],
        note: "The estimated financial effect represents the additional raw material cost arising from the projected increase in coconut shell charcoal prices and does not represent total raw material expenditure. Near-term impacts are expected to be concentrated in Sri Lanka, while medium- and long-term exposure increases across all sourcing regions.",
      },
    ],
  },
  {
    id: "CRRO 2",
    shortName: "Physical water risk",
    name: "Physical Climate-Related Water Risk",
    classification: "Risk",
    color: "#168E95",
    light: "#DDF3F3",
    iconSvg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.8c3.4 4 5.1 6.6 5.1 8.5A5.1 5.1 0 1 1 6.9 13.3c0-1.9 1.7-4.5 5.1-8.5Z"></path><path d="M8.9 16.1c.8.9 1.8 1.4 3.1 1.4 1.2 0 2.3-.5 3.1-1.4"></path></svg>`,
    description: "Water risk arising from changes in water availability, water quality and hydrological variability.",
    keyDriver: "Loss of usable washing water",
    keyFinancial: "Incremental revenue loss",
    driver: {
      title: "Estimated Loss of Usable Water for Product Washing",
      subtitle: "Percentage reduction in available washing water",
      axis: "Water availability reduction",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 5, high: 10 },
        { h: "MT", low: 15, high: 30 },
        { h: "LT", low: 20, high: 30 },
      ],
      note: "Washing is required for selected activated carbon grades, including all energy storage carbons and certain air- and water-purification products. The model separately assesses water demand for washing and steam generation, recognising that steam generation requires considerably less water per metric tonne of output.",
    },
    financial: [
      {
        title: "Incremental Revenue Loss",
        subtitle: "Estimated revenue impact from reduced production",
        axis: "Revenue loss",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 0.5, high: 1.7 },
          { h: "MT", low: 2, high: 8 },
          { h: "LT", low: 3, high: 8 },
        ],
        note: "The estimated revenue loss mainly reflects reduced production of washing-dependent grades. Energy Storage Carbon production is expected to be prioritised, but may also be affected under more severe or prolonged water constraints where resilience measures are insufficient. Revenue loss is presented as a range to reflect variability across scenarios.",
      },
    ],
  },
  {
    id: "CRRO 3",
    shortName: "Renewable energy opportunity",
    name: "Renewable Energy Adoption Opportunity",
    classification: "Opportunity",
    color: "#4A9B52",
    light: "#E4F2E3",
    iconSvg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2.8 6.8 13h4.5l-1 8.2L17.2 11h-4.5l.8-8.2Z"></path></svg>`,
    description: "Opportunity to scale renewable energy adoption in response to fossil-fuel price volatility and supply disruption.",
    keyDriver: "Renewable energy share",
    keyFinancial: "Fossil-fuel-related cost reduction",
    driver: {
      title: "Renewable Energy Share under the ACTIVATE 2030 Boundary",
      subtitle: "Projected increase in renewable energy share",
      axis: "Renewable energy share",
      unit: "%",
      format: "percent",
      values: [
        { h: "ST", low: 9, high: 9 },
        { h: "MT", low: 30, high: 30 },
        { h: "LT", low: 50, high: 50 },
      ],
      note: "Haycarb has historically used waste heat to generate steam, which remains a major component of its renewable energy use. However, the ACTIVATE 2030 renewable energy target excludes this legacy utilisation and measures progress from the FY 2022/23 baseline through additional renewable energy sources.",
    },
    financial: [
      {
        title: "Estimated Reduction in Fossil-Fuel-Related Cost of Sales",
        subtitle: "Estimated financial benefit from reduced exposure to fossil-fuel-related costs",
        axis: "Anticipated cost reduction",
        unit: "%",
        format: "percent",
        values: [
          { h: "ST", low: 0, high: 0 },
          { h: "MT", low: 5, high: 15 },
          { h: "LT", low: 10, high: 15 },
        ],
        note: "No cost reduction is anticipated in the short term due to the initial investment required to expand renewable energy capacity. Financial benefits are expected to materialise over the medium and long term as renewable energy use increases. The percentages are presented as positive values to show the magnitude of the anticipated reduction in fossil-fuel-related cost of sales; they do not represent an increase in cost.",
      },
    ],
  },
  {
    id: "CRRO 4",
    shortName: "Value-added carbon opportunity",
    name: "Growing Market Demand Opportunity",
    classification: "Opportunity",
    color: "#7253A6",
    light: "#EDE7F7",
    iconSvg: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17.5 17.5 6"></path><path d="M10.7 6H17.5v6.8"></path><path d="M6 8.8V18h9.2"></path></svg>`,
    description: "Opportunity from growing demand for value-added carbons used in energy storage, advanced water purification and air purification.",
    keyDriver: "Climate-solution-focused ESC production expansion",
    keyFinancial: "Climate-solution revenue opportunity",
    driver: {
      title: "Indicative Energy Storage Carbon Production Expansion",
      subtitle: "Production index relative to FY 2025/26 (baseline = 1.0)",
      axis: "Production index",
      unit: "×",
      format: "multiple",
      values: [
        { h: "ST", low: 1, high: 1.4 },
        { h: "MT", low: 1.4, high: 3 },
        { h: "LT", low: 3, high: 3.4 },
      ],
      note: "Production values are presented as an index relative to FY 2025/26, which is set at 1.0. The chart shows the indicative expansion in Energy Storage Carbon production attributable specifically to climate-solution demand, rather than total Energy Storage Carbon expansion, and does not disclose absolute production volumes.",
    },
    financial: [
      {
        title: "Climate-Solution Revenue Opportunity",
        subtitle: "Estimated incremental revenue from climate-solution applications",
        axis: "Revenue uplift",
        unit: "LKR bn",
        format: "number",
        values: [
          { h: "ST", low: 0.5, high: 1 },
          { h: "MT", low: 2, high: 5 },
          { h: "LT", low: 5, high: 8 },
        ],
        note: "The estimated revenue uplift reflects only climate-solution applications of Energy Storage Carbons. Revenue from other Energy Storage Carbon applications not directly linked to climate solutions, as well as Haycarb's other major product applications, including air and water purification, has been excluded.",
      },
    ],
  },
];
