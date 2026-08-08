export const COUNTRY_COLORS: Record<string, string> = {
  "Sri Lanka": "#E77950",
  "Indonesia": "#168E95",
  "Thailand": "#79B66A",
  "Philippines": "#7A4938",
  "India": "#D6A15B",
};

export const SCENARIO_COLORS: Record<string, string> = {
  netZero: "#E77950",
  current: "#168E95",
  divergence: "#4A9B52",
};

export interface ClimateChartSeries {
  [key: string]: number[];
}

export interface ClimateChartSegment {
  segment: string;
  netZero: number;
  current: number;
  divergence: number;
}

export interface ClimateChartBand {
  start: number;
  end: number;
  label: string;
}

export interface ClimateChartData {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  type: "multiline" | "singleline" | "groupedbar";
  years?: number[];
  series?: ClimateChartSeries;
  segments?: ClimateChartSegment[];
  projectionStart?: number;
  bands?: ClimateChartBand[];
  insight?: string;
}

export const CLIMATE_CHARTS: Record<string, ClimateChartData> = {
  rainfall: {
    id: "rainfall",
    title: "Rainfall Projection — Manufacturing and Sourcing Countries",
    subtitle:
      "2015–2035; solid lines show observed values and dashed lines show projections.",
    unit: "mm",
    type: "multiline",
    years: [
      2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
      2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
    ],
    series: {
      "Sri Lanka": [
        1820, 1750, 2050, 1680, 1920, 2010, 2150, 1890, 2020, 2100, 2080,
        2110, 1850, 2130, 2160, 2200, 1920, 2250, 2200, 2180, 2230,
      ],
      Indonesia: [
        2680, 2720, 2810, 2590, 2640, 2780, 2850, 2770, 2700, 2730, 2760,
        2790, 2610, 2820, 2850, 2870, 2700, 2900, 2880, 2860, 2900,
      ],
      Thailand: [
        1420, 1390, 1580, 1500, 1343, 1460, 1540, 1510, 1480, 1520, 1510,
        1530, 1350, 1560, 1580, 1600, 1420, 1640, 1620, 1600, 1650,
      ],
      Philippines: [
        2180, 2090, 2350, 2200, 2100, 2280, 2400, 2210, 2050, 2190, 2200,
        2230, 2000, 2260, 2290, 2310, 2100, 2350, 2330, 2300, 2360,
      ],
      India: [
        1068, 1105, 1199, 1083, 1101, 1160, 1236, 1257, 1102, 1205, 1190,
        1210, 1080, 1230, 1250, 1270, 1120, 1290, 1270, 1260, 1295,
      ],
    },
    projectionStart: 2026,
    insight:
      "Projected rainfall remains volatile across all sourcing countries, with synchronised downward stress in 2027 and 2031.",
  },
  enso: {
    id: "enso",
    title: "El Niño Yield Impact — Historical vs Projected",
    subtitle: "Composite yield index, 2015–2035",
    unit: "Composite index",
    type: "singleline",
    years: [
      2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
      2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
    ],
    series: {
      "Composite Index": [
        10.874, 11.016, 10.64, 10.68, 10.292, 10.796, 11.056, 11.006, 11.156,
        11.32, 11.33, 11.34, 10.78, 11.38, 11.41, 11.4, 10.83, 11.42, 11.44,
        11.44, 11.44,
      ],
    },
    projectionStart: 2027,
    bands: [
      { start: 2015, end: 2016, label: "El Niño" },
      { start: 2023, end: 2024, label: "El Niño" },
      { start: 2027, end: 2027, label: "Projected El Niño" },
      { start: 2031, end: 2031, label: "Projected El Niño" },
    ],
    insight:
      "The composite yield index shows sharp downward spikes in historical and projected El Niño periods, especially 2027 and 2031.",
  },
  yieldCompare: {
    id: "yieldCompare",
    title: "All-Country Yield Comparison",
    subtitle: "Manufacturing and sourcing countries, 2015–2024",
    unit: "Million tonnes",
    type: "multiline",
    years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    series: {
      "Sri Lanka": [2.11, 2.3, 1.96, 2.1, 2.25, 2.45, 2.5, 2.35, 2.48, 2.56],
      Indonesia: [
        16.8, 17.1, 17, 16.9, 16.7, 17, 17.1, 17.2, 17.1, 17.2,
      ],
      Thailand: [1.1, 1.05, 1.02, 0.95, 0.618, 0.75, 0.85, 0.92, 0.96, 0.98],
      Philippines: [
        15.35, 14.97, 14.73, 14.68, 14.09, 14.52, 14.68, 14.75, 14.7, 14.8,
      ],
      India: [
        14.57, 14.81, 15.07, 15.02, 14.68, 14.96, 15.3, 15.33, 15.33, 15.5,
      ],
    },
    insight:
      "Indonesia and India dominate total volume, while Thailand is the smallest and most structurally volatile source.",
  },
  yoyYield: {
    id: "yoyYield",
    title: "Year-on-Year Change in Coconut Yield",
    subtitle: "Manufacturing and sourcing countries, 2016–2024",
    unit: "%",
    type: "multiline",
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    series: {
      "Sri Lanka": [
        9.0, -14.78, 7.14, 7.14, 8.89, 2.04, -6.0, 5.53, 3.23,
      ],
      Indonesia: [
        1.79, -0.58, -0.59, -1.18, 1.8, 0.59, 0.58, -0.58, 0.58,
      ],
      Thailand: [
        -4.55, -2.86, -6.86, -34.95, 21.36, 13.33, 8.24, 4.35, 2.08,
      ],
      Philippines: [
        -2.48, -1.6, -0.34, -4.02, 3.05, 1.1, 0.48, -0.34, 0.68,
      ],
      India: [1.65, 1.76, -0.33, -2.26, 1.91, 2.27, 0.2, 0, 1.11],
    },
    insight:
      "Thailand exhibits the greatest year-to-year volatility, while Sri Lanka records a notable contraction in 2017 followed by recovery.",
  },
  shellIndex: {
    id: "shellIndex",
    title: "Coconut Shell Availability Projection",
    subtitle: "Index, 2025 = 100",
    unit: "Index",
    type: "multiline",
    years: [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035],
    series: {
      "Sri Lanka": [100, 100.8, 86.6, 102.4, 103.2, 104, 89.8, 105.6, 106.4, 107.2, 108],
      Indonesia: [100, 100.3, 92.6, 100.9, 101.2, 101.5, 93.8, 102.1, 102.4, 102.7, 103],
      Thailand: [100, 98, 84, 94, 92, 90, 76, 86, 84, 82, 80],
      Philippines: [100, 99.5, 87, 98.5, 98, 97.5, 85, 96.5, 96, 95.5, 95],
      India: [100, 101, 96, 103, 104, 105, 100, 107, 108, 109, 110],
    },
    projectionStart: 2025,
    insight:
      "By 2035, India and Sri Lanka rise above baseline, while Thailand and the Philippines remain structurally below the 2025 index.",
  },
  growthMultiples: {
    id: "growthMultiples",
    title: "Segment Growth of Value-Added Carbon under Selected Scenarios",
    subtitle: "2035 value divided by 2024 value",
    unit: "Growth multiple",
    type: "groupedbar",
    segments: [
      { segment: "EDLC AC", netZero: 5.5, current: 3.52, divergence: 2.56 },
      { segment: "Si-C anode", netZero: 37.2, current: 22.25, divergence: 11.83 },
      { segment: "Water purif. AC", netZero: 3.17, current: 2.67, divergence: 2.17 },
      { segment: "PFAS GAC", netZero: 4.22, current: 2.53, divergence: 1.96 },
    ],
    insight:
      "The Net Zero pathway produces the strongest growth across all segments, led by the silicon-carbon anode market.",
  },
};
