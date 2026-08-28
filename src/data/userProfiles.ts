export type TabId =
  | "shareholders"
  | "employees"
  | "customers"
  | "suppliers"
  | "generalUser";

export interface Metric {
  value: string;
  label: string;
}

export interface MetricGroup {
  title?: string;
  metrics: Metric[];
}

export interface DownloadLink {
  label: string;
  pdf: string;
}

export interface ProfileTab {
  id: TabId;
  title: string;
  heroTitle: string;
  intro?: string;
  metricGroups: MetricGroup[];
  message?: {
    title: string;
    text: string;
  };
  highlights?: string[];
  strategy?: {
    title: string;
    items?: string[];
    text?: string;
    download?: DownloadLink;
  };
  governance?: {
    title: string;
    text: string;
    paragraphs: string[];
    download: DownloadLink;
  };
  strategyImage?: {
    title: string;
    image: string;
    caption: string;
  };
}

export interface KeyFeature {
  icon: "ai" | "sustainability" | "financial" | "governance" | "accessibility";
  title: string;
  detail: string;
  subItems?: string[];
}

export const KEY_FEATURES: KeyFeature[] = [
  {
    icon: "ai",
    title: "AI-Enabled Digital Report",
    detail:
      "Intelligence woven through every page of the digital annual report.",
    subItems: [
      "Conversational Report Intelligence",
      "Adaptive Stakeholder Experiences",
      "Predictive Intelligence Analytics",
      "Multilingual & Accessible Intelligence",
      "AI-Powered Insight Visualisation & Report Generation",
      "Interactive Impact Intelligence",
      "Gamified Report Exploration",
    ],
  },
  {
    icon: "sustainability",
    title: "Sustainability Reporting Enhancements",
    detail:
      "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance.",
  },
  {
    icon: "financial",
    title: "Financial Reporting Improvements",
    detail:
      "Early adoption of SLFRS 18 with improved presentation and expanded disclosures.",
  },
  {
    icon: "governance",
    title: "Corporate Governance Presentation",
    detail: "More visual, streamlined corporate governance reporting.",
  },
  {
    icon: "accessibility",
    title: "Accessibility Advancements",
    detail: "Braille reporting and sign language, integrated video content.",
  },
];

const corporateGovernanceDownload: DownloadLink = {
  label: "Download Corporate Governance",
  pdf: "/pdf/tbc/Corporate%20Governance.pdf",
};

const chairmanMessageTitle = "Leadership Message";

const governanceParaOne =
  "At Haycarb PLC, corporate governance is not merely a compliance obligation, it is a cornerstone of our leadership philosophy and strategic execution. Under the stewardship of a committed Board and guided by the principles of transparency, accountability, and integrity, our governance framework ensures that every decision aligns with the long-term interests of our stakeholders and the sustainability of our operations.";

const governanceParaTwo =
  "This section outlines the roles and responsibilities of our leadership, including the Chairman and Managing Director, and details the mechanisms through which Haycarb maintains oversight across its geographically diverse subsidiaries. It also highlights the formation and function of key Board Committees such as the Nominations and Governance Committee, Audit Committee, and Remuneration Committee, which collectively uphold the standards of ethical leadership and sound governance.";

const governanceParaThree =
  "Through continuous evaluation, structured succession planning, and alignment with the Hayleys Group's ESG roadmap, Haycarb reinforces its commitment to responsible leadership and resilient governance practices.";

const governanceParagraphs = [
  governanceParaOne,
  governanceParaTwo,
  governanceParaThree,
];

const governanceText = governanceParagraphs.join(" ");

export const PROFILE_TABS: ProfileTab[] = [
  {
    id: "shareholders",
    title: "Shareholders",
    heroTitle: "Performance with a clearer line of sight",
    intro:
      "As the guiding current beneath our journey, you steer Haycarb's course. Dive into a clear view of our performance, strategy, and sustainable growth.",
    metricGroups: [
      {
        metrics: [
          { value: "Rs. 12.18", label: "Earnings Per Share" },
          { value: "12.3%", label: "Return on Equity" },
          { value: "Rs. 98.83", label: "Net Asset Value per Share" },
          { value: "Rs. 4.07", label: "Dividends per Share" },
          { value: "13.4%", label: "Return on Capital Employed" },
        ],
      },
    ],
    message: {
      title: chairmanMessageTitle,
      text: "Haycarb recorded a Profit Before Tax (PBT) of Rs. 5.89 Bn for the year ended 31st March 2026, reflecting a 7% increase over the previous year's Rs. 5.52 Bn despite operating in a challenging global environment. Revenue grew significantly to Rs. 67.08 Bn from Rs. 43.20 Bn in the previous year, driven by strong demand, strategic pricing initiatives, and operational excellence. Tax expense increased to Rs. 1.55 Bn, resulting in an effective tax rate of 26.3% compared to 22.6% in the previous year. Consequently, Profit After Tax (PAT) improved marginally to Rs. 4.34 Bn from Rs. 4.27 Bn in 2024/25. In USD terms, Profit After Tax amounted to USD 14.22 Mn.",
    },
    highlights: [
      "Financial performance, position and resilience",
      "Opportunities for sustainable growth",
      "Corporate governance",
      "Adequacy of risk management",
      "Corporate reputation",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "Strategic interventions to secure adequate supplies of raw material to support stable volumes",
        "Revised prices upward to support margin management",
        "Pursued strategic expansion in growth markets",
        "Ongoing emphasis on innovation and expansion of the value-added product portfolio to strengthen margins",
        "Drove progress on expanding our manufacturing footprint to the Philippines",
        "Robust risk management to identify and respond to risks and opportunities including climate related risks",
      ],
    },
    governance: {
      title: "Leadership and Governance",
      text: governanceText,
      paragraphs: governanceParagraphs,
      download: corporateGovernanceDownload,
    },
    strategyImage: {
      title: "Investor Ratios",
      image: "/images/innerpage/user-profile/shareholders.jpeg",
      caption:
        "A clear view of the financial ratios that define shareholder value.",
    },
  },
  {
    id: "employees",
    title: "Employees",
    heroTitle: "People powering what comes next",
    intro:
      "You are the strength behind our journey and your contribution helps us move confidently towards new horizons, transforming possibilities into lasting impact for all our stakeholders.",
    metricGroups: [
      {
        metrics: [
          { value: "2,084", label: "No. of Employees" },
          { value: "85.3%", label: "Employee Retention Rate" },
          { value: "31.1 hrs", label: "Average Training Hours per Employee" },
          { value: "Rs. 5.58 Bn", label: "Payments to Employees" },
          { value: "> Rs. 119 Mn", label: "Investment in Health & Safety" },
        ],
      },
    ],
    message: {
      title: chairmanMessageTitle,
      text: "Haycarb continued to invest in its people during 2025/26, strengthening workforce capability through training, development, and employee engagement initiatives. With an average of 31.1 training hours per employee and continued emphasis on digital learning platforms, the Group focused on equipping its workforce with the skills required to navigate an increasingly dynamic and technology-driven business environment. Supported by an employee retention rate of 85.3% and ongoing investments in health, safety, and wellbeing, Haycarb remains committed to nurturing a capable, engaged, and future-ready workforce that can deliver innovation, operational excellence, and sustainable growth.",
    },
    highlights: [
      "Fair remuneration and job security",
      "A safe and inclusive work environment",
      "Opportunities for training and development",
      "Career progression",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "Goal setting and Performance Appraisals with fair and equitable remuneration for all employees based on skills, competencies and performance",
        "Strengthened the safety culture within the Group",
        "Continuous learning with investment of Rs. 7.4 million and launching digital learning platform",
        "Introduced a post onboarding review system to support the integration of new recruits",
        "Fostered a diverse and inclusive work environment",
      ],
      download: {
        label: "Download HR Strategy",
        pdf: "/pdf/tbc/Human%20Capital.pdf",
      },
    },
    strategyImage: {
      title: "Our HR Strategy",
      image: "/images/innerpage/user-profile/employee.jpeg",
      caption: "Investing in our people to fuel innovation and shared growth.",
    },
  },
  {
    id: "customers",
    title: "Customers",
    heroTitle: "Innovation designed around customer value",
    intro:
      "With you, we look Beyond the Beyond. Discover how Haycarb delivers consistency, quality, and sustainability while pursuing new opportunities and advancing towards a future of greater possibilities.",
    metricGroups: [
      {
        metrics: [
          { value: ">90%", label: "Customer Satisfaction Score" },
          { value: "19", label: "New Customers" },
          { value: "14", label: "New Products Launched" },
          { value: "3", label: "Products in Pipeline" },
          { value: "Rs. 261 Mn", label: "Investment in R&D" },
        ],
      },
    ],
    message: {
      title: chairmanMessageTitle,
      text: "Haycarb continued to invest in innovation, research, and advanced technologies during 2025/26, reinforcing its position as a leading provider of sustainable activated carbon solutions. The Group remained focused on developing cutting-edge products and enhancing customer value through continuous investment in research and development, which amounted to Rs. 261 Mn during the year. Haycarb successfully launched 14 new products, reflecting its commitment to sustainable innovation and its ability to address emerging customer requirements across diverse applications. Supported by enhanced laboratory capabilities, specialised technical training, and ongoing digitalisation initiatives, the Group continued to strengthen its innovation pipeline and technical differentiation. As global demand for environmental and sustainability-focused solutions continues to grow, Haycarb remains well positioned to capture emerging opportunities through its strong innovation culture, extensive product portfolio, and commitment to creating long-term value for customers and stakeholders.",
    },
    highlights: [
      "Ability to manage optimum capacity utilization and ensure product availability",
      "Rising prices",
      "Capacity to innovate",
      "Consistent product quality and timely delivery",
      "Sustainable and ethical business practices",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "New product development through R&D to deliver tailored solutions that fulfill specific customer needs",
        "Numerous initiatives to source adequate supplies of raw materials are procured from all countries in supply chain",
        "Capacity enhancement",
        "Delivered on several ESG goals outlined in \u201CActivate\u201D",
        "Robust manufacturing and quality assurance systems along with numerous certifications such as ISO and GMP to ensure consistent product quality",
      ],
      download: {
        label: "Download Customer Value Proposition",
        pdf: "/pdf/tbc/Our%20Products.pdf",
      },
    },
    strategyImage: {
      title: "Our Customer Value Proposition",
      image: "/images/innerpage/user-profile/customers.jpeg",
      caption: "What we deliver, and why our customers stay with us.",
    },
  },
  {
    id: "suppliers",
    title: "Suppliers",
    heroTitle: "Stronger partnerships shaping resilient supply chains",
    intro:
      "Strong partnerships are the foundation of our progress. Together, we go Beyond the Beyond, strengthening resilient and responsible supply chains that drive shared growth and long-term sustainability.",
    metricGroups: [
      {
        metrics: [
          {
            value: "Rs. 32.0 Bn",
            label: "Payments to Coconut Shell and Charcoal Suppliers",
          },
          {
            value: "Rs. 19.0 Mn",
            label: "Investment in Supplier Capacity Building",
          },
          {
            value: ">500",
            label:
              "Total No. of Coconut Shell and Charcoal Suppliers Supported",
          },
          {
            value: "> 200",
            label: "Total no. of other material and service Suppliers",
          },
          {
            value: "71%",
            label:
              "Procurement Spend Paid to Coconut Shell and Charcoal Suppliers",
          },
        ],
      },
    ],
    message: {
      title: chairmanMessageTitle,
      text: "Our value chain commences with coconut shells, a by-product of the coconut industry. Our manufacturing facilities are strategically located in Sri Lanka, Thailand, and Indonesia, providing direct access to our main raw material, coconut shell-based charcoal in these countries. Our raw material procurement network also extends to other major coconut growing countries in Asia, including the Philippines, India, and Vietnam. This extensive network has enabled us to gain valuable insights into the production and availability of raw materials, allowing us to effectively manage the cyclical volatility in demand and supply across all coconut-producing countries in Asia.",
    },
    highlights: [
      "Sourcing adequate supplies of coconut shells amidst the shortage",
      "Competitive prices and timely payments",
      "Building long-term relationships",
      "Technical support and capacity building",
      "Environmental and social compliance",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "Strengthened our supplier value proposition",
        "Maintained emphasis on ethical procurement practices and timely payments",
        "Engaged in capacity building through supplier audits and other initiatives",
        "Propagated green charcoaling practices among suppliers",
      ],
      download: {
        label: "Download Supplier Value Proposition",
        pdf: "/pdf/tbc/Listening%20to%20Our%20Stakeholders.pdf",
      },
    },
    strategyImage: {
      title: "Our Supplier Value Proposition",
      image: "/images/innerpage/user-profile/suppliers.jpeg",
      caption:
        "Building resilient, responsible supply chains that move as one.",
    },
  },
  {
    id: "generalUser",
    title: "General User",
    heroTitle: "Discovering Haycarb and the possibilities that lie beyond",
    metricGroups: [
      {
        title: "Financial",
        metrics: [
          { value: "Rs. 67,084 Mn", label: "Revenue" },
          { value: "Rs. 5,887 Mn", label: "Profit Before Tax" },
          { value: "Rs. 4,341 Mn", label: "Profit After Tax" },
        ],
      },
      {
        title: "Non-Financial",
        metrics: [
          { value: "Rs. 52.7 Mn", label: "Investment in CSR" },
          { value: "14 Nos", label: "New products developed" },
          { value: "31.1 Hours", label: "Average training hours per employee" },
        ],
      },
    ],
    governance: {
      title: "Leadership and Governance",
      text: governanceText,
      paragraphs: governanceParagraphs,
      download: corporateGovernanceDownload,
    },
    strategyImage: {
      title: "Our Strategic Levers for Sustainable Growth",
      image: "/images/innerpage/user-profile/general_users.jpeg",
      caption:
        "The levers powering Haycarb's sustainable global value creation.",
    },
  },
];
