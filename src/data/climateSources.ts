export interface SourceItem {
  title: string;
  organisation: string;
  year: string;
  url?: string;
  supports?: string;
}

export interface SourceMapEntry {
  name: string;
  supports: string;
  sources: string[];
  annualReport?: { label: string; reportPage: number; pdfPage: number }[];
}

export const SOURCE_LIBRARY: Record<string, SourceItem> = {
  ipcc_ar6: {
    title: "IPCC Sixth Assessment Report (AR6) — climate scenarios and regional projections",
    organisation: "Intergovernmental Panel on Climate Change (IPCC)",
    year: "2021–2023",
    url: "https://www.ipcc.ch/report/ar6/wg1/",
    supports: "SSP1-2.6 and SSP2-4.5 scenario framing and regional evidence on rainfall, temperature, hydrological variability and climate extremes.",
  },
  iea_nze: {
    title: "Net Zero by 2050: A Roadmap for the Global Energy Sector",
    organisation: "International Energy Agency (IEA)",
    year: "2021",
    url: "https://www.iea.org/reports/net-zero-by-2050",
    supports: "Renewable energy transition pathways and fossil-fuel substitution assumptions.",
  },
  iea_aps: {
    title: "Announced Pledges Scenario (APS) — Global Energy and Climate Model",
    organisation: "International Energy Agency (IEA)",
    year: "2025 online edition",
    url: "https://www.iea.org/reports/global-energy-and-climate-model/",
    supports: "Scenario comparison for energy mix and emissions trajectory.",
  },
  unfccc_ndc: {
    title: "Nationally Determined Contributions Registry",
    organisation: "United Nations Framework Convention on Climate Change (UNFCCC)",
    year: "Current registry",
    url: "https://unfccc.int/NDCREG",
    supports: "National climate pledges and policy context for sourcing countries.",
  },
  noaa_oni: {
    title: "Oceanic Niño Index (ONI) time series",
    organisation: "NOAA Physical Sciences Laboratory / Climate Prediction Center",
    year: "1950–2025 data series used",
    url: "https://psl.noaa.gov/data/timeseries/month/DS/ONI/",
    supports: "El Niño–Southern Oscillation phase identification and historical frequency.",
  },
  worldbank_cckp: {
    title: "Climate Change Knowledge Portal",
    organisation: "World Bank Group",
    year: "Current portal",
    url: "https://climateknowledgeportal.worldbank.org/",
    supports: "Country-level climate projections, vulnerability indicators and adaptation data.",
  },
  faostat: {
    title: "FAOSTAT — Crops and Livestock Products",
    organisation: "Food and Agriculture Organization of the United Nations (FAO)",
    year: "1961–2024 data series used",
    url: "https://www.fao.org/faostat/en/#data/QCL",
    supports: "Coconut production, yield and trade statistics for sourcing countries.",
  },
  national_coconut: {
    title: "National coconut authorities data",
    organisation: "Relevant national coconut and agricultural authorities",
    year: "Various",
    supports: "Country-level coconut supply, shell availability and industry reports.",
  },
  peer_reviewed_coconut: {
    title: "Peer-reviewed coconut and carbon research",
    organisation: "Academic and industry publications",
    year: "Various",
    supports: "Coconut shell charcoal properties, activated carbon production and market analysis.",
  },
  regional_water_records: {
    title: "Regional water authority records",
    organisation: "National and regional water management agencies",
    year: "Various",
    supports: "Water availability, quality and allocation data for manufacturing regions.",
  },
  national_water_assessments: {
    title: "National water resource assessments",
    organisation: "Government water agencies",
    year: "Various",
    supports: "Water stress indicators, abstraction data and climate-water impact assessments.",
  },
  growth_multiples: {
    title: "Segment growth projections",
    organisation: "Industry analysis and internal modelling",
    year: "2024–2035",
    supports: "Market size projections for value-added carbon segments under selected scenarios.",
  },
  haycarb_report: {
    title: "Haycarb PLC Annual Report 2025/26 — Climate-related risks, opportunities and resilience",
    organisation: "Haycarb PLC",
    year: "2026",
    url: "https://cdn.cse.lk/cmt/upload_report_file/494_1780912833539.pdf",
    supports: "Published CRRO definitions, quantified estimate ranges, anticipated financial effects, scenario analysis, resilience sensitivity and management responses.",
  },
};

export const SOURCE_MAP: Record<string, SourceMapEntry> = {
  "crro1-driver": {
    name: "CRRO 1 — Coconut shell charcoal cost driver",
    supports: "Estimated average coconut shell charcoal cost increase across major sourcing regions.",
    sources: ["haycarb_report", "worldbank_cckp", "noaa_oni", "faostat", "national_coconut", "peer_reviewed_coconut"],
    annualReport: [
      { label: "CRRO 1 anticipated financial effects — p. 73", reportPage: 73, pdfPage: 75 },
      { label: "Climate resilience evidence — pp. 94–98", reportPage: 94, pdfPage: 96 },
    ],
  },
  "crro1-financial-0": {
    name: "CRRO 1 — Incremental raw material cost",
    supports: "Estimated incremental raw material cost arising from projected coconut shell charcoal price increases.",
    sources: ["haycarb_report", "worldbank_cckp", "noaa_oni", "faostat", "national_coconut"],
    annualReport: [
      { label: "CRRO 1 anticipated financial effects — p. 73", reportPage: 73, pdfPage: 75 },
      { label: "Resilience sensitivity — pp. 97–98", reportPage: 97, pdfPage: 99 },
    ],
  },
  "crro2-driver": {
    name: "CRRO 2 — Usable washing-water loss",
    supports: "Modelled loss of usable water for product washing under physical climate-related water risk.",
    sources: ["haycarb_report", "worldbank_cckp", "ipcc_ar6", "regional_water_records", "national_water_assessments"],
    annualReport: [
      { label: "CRRO 2 anticipated financial effects — p. 77", reportPage: 77, pdfPage: 79 },
    ],
  },
  "crro2-financial-0": {
    name: "CRRO 2 — Incremental revenue loss",
    supports: "Estimated revenue loss from reduced production of washing-dependent grades.",
    sources: ["haycarb_report", "worldbank_cckp", "ipcc_ar6", "national_water_assessments"],
    annualReport: [
      { label: "CRRO 2 anticipated financial effects — p. 77", reportPage: 77, pdfPage: 79 },
    ],
  },
  "crro3-driver": {
    name: "CRRO 3 — Renewable-energy share",
    supports: "Projected increase in renewable energy share under the ACTIVATE 2030 boundary.",
    sources: ["haycarb_report", "ipcc_ar6", "iea_nze", "iea_aps", "unfccc_ndc"],
    annualReport: [
      { label: "CRRO 3 anticipated financial effects — p. 80", reportPage: 80, pdfPage: 82 },
    ],
  },
  "crro3-financial-0": {
    name: "CRRO 3 — Fossil-fuel-related cost reduction",
    supports: "Estimated reduction in fossil-fuel-related cost of sales from renewable energy adoption.",
    sources: ["haycarb_report", "ipcc_ar6", "iea_nze", "iea_aps", "unfccc_ndc"],
    annualReport: [
      { label: "CRRO 3 anticipated financial effects — p. 80", reportPage: 80, pdfPage: 82 },
    ],
  },
  "crro4-driver": {
    name: "CRRO 4 — Climate-solution-focused ESC production expansion",
    supports: "Indicative Energy Storage Carbon production expansion attributable to climate-solution demand.",
    sources: ["haycarb_report", "ipcc_ar6", "iea_nze", "iea_aps", "unfccc_ndc"],
    annualReport: [
      { label: "CRRO 4 anticipated financial effects — p. 84", reportPage: 84, pdfPage: 86 },
    ],
  },
  "crro4-financial-0": {
    name: "CRRO 4 — Climate-solution revenue opportunity",
    supports: "Estimated incremental revenue from climate-solution applications of Energy Storage Carbons.",
    sources: ["haycarb_report", "ipcc_ar6", "iea_nze", "iea_aps", "unfccc_ndc"],
    annualReport: [
      { label: "CRRO 4 anticipated financial effects — p. 84", reportPage: 84, pdfPage: 86 },
    ],
  },
  rainfall: {
    name: "Rainfall Projection — Manufacturing and Sourcing Countries",
    supports: "Projected rainfall trends across Sri Lanka, India, Indonesia, Thailand and Philippines.",
    sources: ["worldbank_cckp", "noaa_oni"],
  },
  enso: {
    name: "El Niño Yield Impact — Historical vs Projected",
    supports: "Composite yield index under El Niño–Southern Oscillation phases.",
    sources: ["noaa_oni", "faostat"],
  },
  yieldCompare: {
    name: "All-Country Yield Comparison",
    supports: "Historical coconut yield data across manufacturing and sourcing countries.",
    sources: ["faostat", "national_coconut"],
  },
  yoyYield: {
    name: "Year-on-Year Change in Coconut Yield",
    supports: "Annual yield variability across sourcing countries.",
    sources: ["faostat", "national_coconut"],
  },
  shellIndex: {
    name: "Coconut Shell Availability Projection",
    supports: "Projected shell availability index relative to FY 2025/26 baseline.",
    sources: ["faostat", "national_coconut", "peer_reviewed_coconut"],
  },
  growthMultiples: {
    name: "Segment Growth of Value-Added Carbon under Selected Scenarios",
    supports: "Market growth projections for value-added carbon segments.",
    sources: ["growth_multiples"],
  },
};

export const ANNUAL_REPORT_URL =
  "https://www.haycarb.com/wp-content/uploads/2026/07/Sustainability-Impact-Report-July.2026.pdf";
