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
  metricsIntro?: string;
  metricGroups: MetricGroup[];
  message?: {
    title: string;
    text: string;
    link?: {
      label: string;
      url: string;
    };
  };
  highlights?: string[];
  highlightIcons?: string[];
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
  keyFeatures?: {
    description: string;
    items: KeyFeature[];
  };
  strategyImage?: {
    title: string;
    image: string;
    caption: string;
  };
  aiReportText?: string;
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
    title: "The Next Horizon of Intelligent Reporting",
    detail:
      "Taking reporting beyond disclosure, our AI-enabled digital experience helps stakeholders discover relevant information, explore deeper insights and engage with Haycarb's performance in a more personalised way",
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
      "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
  },
  {
    icon: "financial",
    title: "Financial Reporting Improvements",
    detail:
      "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
  },
  {
    icon: "governance",
    title: "Corporate Governance Presentation",
    detail: "More visual, streamlined corporate governance reporting",
  },
  {
    icon: "accessibility",
    title: "Accessibility Advancements",
    detail: "Braille reporting and sign language, integrated video content",
  },
];

const corporateGovernanceDownload: DownloadLink = {
  label: "Download Corporate Governance",
  pdf: "/pdf/tbc/Corporate%20Governance.pdf",
};

const chairmanMessageTitle = "Leadership Message";

const shareholderGovernanceParagraphs = [
  "At Haycarb PLC, corporate governance is not merely a compliance obligation, it is a cornerstone of our leadership philosophy and strategic execution.",
  "Under the stewardship of a committed Board and guided by the principles of transparency, accountability, and integrity, our governance framework ensures that every decision aligns with the long term interests of our stakeholders and the sustainability of our operations.",
  "Haycarb’s governance framework brings together clearly defined leadership responsibilities, effective Board oversight and dedicated Committees across its global operations, supported by continuous evaluation, structured succession planning and alignment with the Hayleys Group’s ESG roadmap to uphold responsible leadership and resilient governance.",
];

const generalGovernanceParagraphs = [
  "At Haycarb PLC, corporate governance is not merely a compliance obligation, it is a cornerstone of our leadership philosophy and strategic execution.",
  "Under the stewardship of a committed Board and guided by the principles of transparency, accountability, and integrity, our governance framework ensures that every decision aligns with the long term interests of our stakeholders and the sustainability of our operations.",
  "This section outlines the roles and responsibilities of our leadership, including the Chairman and Managing Director, and details the mechanisms through which Haycarb maintains oversight across its geographically diverse subsidiaries. It also highlights the formation and function of key Board Committees such as the Nominations and Governance Committee, Audit Committee and Remuneration Committee, which collectively uphold the standards of ethical leadership and sound governance.",
  "Through continuous evaluation, structured succession planning and alignment with the Hayleys Group’s ESG roadmap, Haycarb reinforces its commitment to responsible leadership and resilient governance practices.",
];

const shareholderGovernanceText = shareholderGovernanceParagraphs.join(" ");
const governanceText = generalGovernanceParagraphs.join(" ");

export const PROFILE_TABS: ProfileTab[] = [
  {
    id: "shareholders",
    title: "Shareholders",
    heroTitle: "Performance with a clearer line of sight",
    intro:
      "As the guiding current beneath our journey, you steer Haycarb\u2019s course. Dive into a clear view of our performance, strategy, and sustainable growth.",
    metricsIntro:
      "Looking Beyond the Beyond, explore the returns and value created through Haycarb\u2019s performance and our continued focus on sustainable long term growth.",
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
      link: {
        label: "View Joint Message",
        url: "https://youtu.be/K_rvL8qpuDc",
      },
    },
    highlights: [
      "Financial performance, position and resilience",
      "Opportunities for sustainable growth",
      "Corporate governance",
      "Adequacy of risk management",
      "Corporate reputation",
    ],
    highlightIcons: [
      "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-27.svg",
      "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-28.svg",
      "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-29.svg",
      "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-30.svg",
      "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-31.svg",
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
      text: "Focused on strengthening profitability, pursuing strategic growth and managing risks to deliver sustainable long term shareholder value.",
    },
    governance: {
      title: "Leadership and Governance",
      text: shareholderGovernanceText,
      paragraphs: shareholderGovernanceParagraphs,
      download: corporateGovernanceDownload,
    },
    keyFeatures: {
      description:
        "Enhanced reporting, clearer disclosures and greater accessibility provide shareholders with deeper insight into Haycarb\u2019s performance, governance and long term value creation.",
      items: [
        {
          icon: "sustainability",
          title: "Sustainability Reporting Enhancements",
          detail:
            "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
        },
        {
          icon: "financial",
          title: "Financial Reporting Improvements",
          detail:
            "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
        },
        {
          icon: "governance",
          title: "Corporate Governance Presentation",
          detail:
            "More visual, streamlined corporate governance reporting",
        },
        {
          icon: "accessibility",
          title: "Accessibility Advancements",
          detail:
            "Braille reporting and sign language, integrated video content",
        },
      ],
    },
    strategyImage: {
      title: "Our Business Case",
      image: "/images/innerpage/user-profile/shareholders.webp",
      caption:
        "Built on market leadership and global reach, our business model combines innovation, strong capabilities and responsible practices to deliver sustainable value.",
    },
    aiReportText:
      "Taking reporting beyond disclosure, our AI-enabled digital experience helps shareholders discover relevant information, explore deeper insights and engage with Haycarb’s performance in a more personalised way",
  },
  {
    id: "employees",
    title: "Employees",
    heroTitle: "People powering what comes next",
    intro:
      "You are the strength behind our journey and your contribution helps us move confidently towards new horizons, transforming possibilities into lasting impact for all our stakeholders.",
    metricsIntro:
      "Built on the strength of our people, our performance reflects continued progress and a strong foundation for what lies ahead.",
    metricGroups: [
      {
        metrics: [
          { value: "2,084", label: "No. of Employees" },
          { value: "85.3%", label: "Employee Retention Rate" },
          { value: "31.1 hours", label: "Average Training Hours per employee" },
          { value: "Rs. 5.58 Bn", label: "Payments to Employees" },
          { value: "> Rs. 119 Mn", label: "Investment in Health & Safety" },
        ],
      },
    ],
    message: {
      title: chairmanMessageTitle,
      text: "Haycarb continued to invest in its people during 2025/26, strengthening workforce capability through training, development, and employee engagement initiatives. With an average of 31.1 training hours per employee and continued emphasis on digital learning platforms, the Group focused on equipping its workforce with the skills required to navigate an increasingly dynamic and technology-driven business environment. Supported by an employee retention rate of 85.3% and ongoing investments in health, safety, and wellbeing, Haycarb remains committed to nurturing a capable, engaged, and future-ready workforce that can deliver innovation, operational excellence, and sustainable growth.",
      link: {
        label: "View Joint Message",
        url: "https://youtu.be/K_rvL8qpuDc",
      },
    },
    highlights: [
      "Fair remuneration and job security",
      "A safe and inclusive work environment",
      "Opportunities for training and development",
      "Career progression",
    ],
    highlightIcons: [
      "/icons/user-profile/Key-highlights/Employees/Web%20Icons-32.svg",
      "/icons/user-profile/Key-highlights/Employees/Web%20Icons-33.svg",
      "/icons/user-profile/Key-highlights/Employees/Web%20Icons-34.svg",
      "/icons/user-profile/Key-highlights/Employees/Web%20Icons-35.svg",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "Goal setting and Performance Appraisals with fair and equitable remuneration for all employees based on skills, competencies and performance",
        "Strengthened the safety culture within the Group.",
        "Continuous learning with investment of Rs. 7.4 million and launching digital learning platform.",
        "Introduced a post onboarding review system to support the integration of new recruits.",
        "Fostered a diverse and inclusive work environment.",
      ],
      text: "Empowering our people with the skills, opportunities and environment to thrive, while building an engaged, inclusive and future ready workforce.",
      download: {
        label: "Download HR Strategy",
        pdf: "/pdf/tbc/Human%20Capital.pdf",
      },
    },
    keyFeatures: {
      description:
        "Enhanced reporting, clearer disclosures and greater accessibility give our employees a more transparent and inclusive view of Haycarb\u2019s performance, governance and sustainability journey.",
      items: [
        {
          icon: "sustainability",
          title: "Sustainability Reporting Enhancements",
          detail:
            "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
        },
        {
          icon: "financial",
          title: "Financial Reporting Improvements",
          detail:
            "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
        },
        {
          icon: "governance",
          title: "Corporate Governance Presentation",
          detail:
            "More visual, streamlined corporate governance reporting",
        },
        {
          icon: "accessibility",
          title: "Accessibility Advancements",
          detail:
            "Braille reporting and sign language, integrated video content",
        },
      ],
    },
    strategyImage: {
      title: "Our HR Strategy",
      image: "/images/innerpage/user-profile/employee.webp",
      caption:
        "Empowering our people with the skills, opportunities and environment to thrive, while building an engaged, inclusive and future ready workforce.",
    },
    aiReportText:
      "Taking reporting beyond disclosure, our AI-enabled digital experience helps our employees explore Haycarb’s performance, progress and impact through a more personalised, accessible and engaging experience.",
  },
  {
    id: "customers",
    title: "Customers",
    heroTitle: "Innovation designed around customer value",
    intro:
      "With you, we look Beyond the Beyond. Discover how Haycarb delivers consistency, quality, and sustainability while pursuing new opportunities and advancing towards a future of greater possibilities",
    metricsIntro:
      "Looking beyond today\u2019s needs, we continue to innovate and evolve alongside our customers, creating solutions for the opportunities and challenges that lie ahead.",
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
      text: "Haycarb continued to invest in innovation, research and advanced technologies during 2025/26, reinforcing its position as a leading provider of sustainable activated carbon solutions. With Rs. 261 Mn invested in R&D, the Group launched 14 new products, addressing emerging customer requirements across diverse applications and enhancing customer value. Supported by enhanced laboratory capabilities, specialised technical training and ongoing digitalisation, Haycarb continued to strengthen its innovation pipeline and technical differentiation. As global demand for environmental and sustainability focused solutions grows, the Group remains well positioned to capture emerging opportunities through its strong innovation culture and extensive product portfolio, while creating long term value for customers and stakeholders.",
      link: {
        label: "View Joint Message",
        url: "https://youtu.be/K_rvL8qpuDc",
      },
    },
    highlights: [
      "Ability to manage optimum capacity utilization and ensure product availability",
      "Rising prices",
      "Capacity to innovate",
      "Consistent product quality and timely delivery",
      "Sustainable and ethical business practices",
    ],
    highlightIcons: [
      "/icons/user-profile/Key-highlights/Customers/Web%20Icons-36.svg",
      "/icons/user-profile/Key-highlights/Customers/Web%20Icons-37.svg",
      "/icons/user-profile/Key-highlights/Customers/Web%20Icons-38.svg",
      "/icons/user-profile/Key-highlights/Customers/Web%20Icons-39.svg",
      "/icons/user-profile/Key-highlights/Customers/Web%20Icons-40.svg",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "New product development through R&D to deliver tailored solutions that fulfill specific customer needs.",
        "Numerous initiatives to source adequate supplies of raw materials are procured from all countries in supply chain",
        "Capacity enhancement.",
        "Delivered on several ESG goals outlined in ”Activate“.",
        "Robust manufacturing and quality assurance systems along with numerous certifications such as ISO and GMP to ensure consistent product quality.",
      ],
      text: "Creating lasting customer value through solutions, expertise and partnerships shaped around evolving needs.",
      download: {
        label: "Download Customer Value Proposition",
        pdf: "/pdf/tbc/Our%20Products.pdf",
      },
    },
    keyFeatures: {
      description:
        "Enhanced transparency and accessibility provide customers with greater insight into the performance, governance and sustainability practices that underpin Haycarb as a trusted long term partner.",
      items: [
        {
          icon: "sustainability",
          title: "Sustainability Reporting Enhancements",
          detail:
            "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
        },
        {
          icon: "financial",
          title: "Financial Reporting Improvements",
          detail:
            "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
        },
        {
          icon: "governance",
          title: "Corporate Governance Presentation",
          detail:
            "More visual, streamlined corporate governance reporting",
        },
        {
          icon: "accessibility",
          title: "Accessibility Advancements",
          detail:
            "Braille reporting and sign language, integrated video content",
        },
      ],
    },
    strategyImage: {
      title: "Our Customer Value Proposition",
      image: "/images/innerpage/user-profile/customers.webp",
      caption: "Creating lasting customer value through solutions, expertise and partnerships shaped around evolving needs.",
    },
    aiReportText:
      "Taking reporting beyond disclosure, our AI-enabled digital experience helps customers discover relevant information, explore deeper insights and better understand Haycarb's capabilities, performance and sustainability journey.",
  },
  {
    id: "suppliers",
    title: "Suppliers",
    heroTitle: "Stronger partnerships shaping resilient supply chains",
    intro:
      "Strong partnerships are the foundation of our progress. Together, we go Beyond the Beyond, strengthening resilient and responsible supply chains that drive shared growth and long-term sustainability.",
    metricsIntro:
      "Our supplier partnerships extend beyond procurement, creating shared value, strengthening capabilities and building a more resilient supply chain for the future.",
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
      text: "Our value chain commences with coconut shells, a byproduct of the coconut industry. Our manufacturing facilities are strategically located in Sri Lanka, Thailand and Indonesia, providing direct access to our main raw material, coconut shell based charcoal in these countries. Our raw material procurement network also extends to other major coconut growing countries in Asia, including the Philippines, India and Vietnam. This extensive network has enabled us to gain valuable insights into the production and availability of raw materials, allowing us to effectively manage the cyclical volatility in demand and supply across all coconut producing countries in Asia.",
      link: {
        label: "View Joint Message",
        url: "https://youtu.be/K_rvL8qpuDc",
      },
    },
    highlights: [
      "Sourcing adequate supplies of coconut shells amidst the shortage",
      "Competitive prices and timely payments",
      "Building long-term relationships",
      "Technical support and capacity building",
      "Environmental and social compliance",
    ],
    highlightIcons: [
      "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-41.svg",
      "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-42.svg",
      "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-43.svg",
      "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-44.svg",
      "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-45.svg",
    ],
    strategy: {
      title: "Strategy and Performance",
      items: [
        "Strengthened our supplier value proposition",
        "Maintained emphasis on ethical procurement practices and timely payments",
        "Engaged in capacity building through supplier audits and other initiatives",
        "Propagated green charcoaling practices among suppliers",
      ],
      text: "Growing together through partnerships that strengthen capabilities, support livelihoods and create shared value across our supply chain.",
      download: {
        label: "Download Supplier Value Proposition",
        pdf: "/pdf/tbc/Listening%20to%20Our%20Stakeholders.pdf",
      },
    },
    keyFeatures: {
      description:
        "Enhanced reporting, clearer disclosures and greater accessibility provide suppliers with greater visibility into Haycarb\u2019s sustainability commitments, governance and approach to responsible long term value creation.",
      items: [
        {
          icon: "sustainability",
          title: "Sustainability Reporting Enhancements",
          detail:
            "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
        },
        {
          icon: "financial",
          title: "Financial Reporting Improvements",
          detail:
            "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
        },
        {
          icon: "governance",
          title: "Corporate Governance Presentation",
          detail:
            "More visual, streamlined corporate governance reporting",
        },
        {
          icon: "accessibility",
          title: "Accessibility Advancements",
          detail:
            "Braille reporting and sign language, integrated video content",
        },
      ],
    },
    strategyImage: {
      title: "Our Supplier Value Proposition",
      image: "/images/innerpage/user-profile/suppliers.webp",
      caption:
        "Growing together through partnerships that strengthen capabilities, support livelihoods and create shared value across our supply chain.",
    },
    aiReportText:
      "Taking reporting beyond disclosure, our AI enabled digital experience helps suppliers discover relevant information and explore Haycarb’s performance, sustainability priorities and value chain in a more personalised way.",
  },
  {
    id: "generalUser",
    title: "General User",
    heroTitle: "Discovering Haycarb and the possibilities that lie beyond",
    intro:
      "Explore our business, global presence, solutions and impact and discover how Haycarb continues to create value while shaping what comes next.",
    metricsIntro:
      "The year at a glance, bringing together key measures of performance, progress and impact.",
    metricGroups: [
      {
        title: "Financial",
        metrics: [
          { value: "67,084", label: "Revenue (Rs. Mn)" },
          { value: "5,887", label: "Profit Before Tax (Rs. Mn)" },
          { value: "4,341", label: "Profit After Tax (Rs. Mn)" },
        ],
      },
      {
        title: "Non-Financial",
        metrics: [
          { value: "52.7", label: "Investment in CSR (Rs. Mn)" },
          { value: "14", label: "New products developed (Nos)" },
          {
            value: "31.1",
            label: "Average training hours per employee (Hours)",
          },
        ],
      },
    ],
    strategy: {
      title: "Strategy and Resource Allocation",
      text: "Guiding our path forward through focused priorities that strengthen resilience, drive innovation and create sustainable long term value.",
      download: {
        label: "Download Strategy and Resource Allocation",
        pdf: "/pdf/tbc/Strategy%20and%20Resource%20Allocation.pdf",
      },
    },
    governance: {
      title: "Leadership and Governance",
      text: governanceText,
      paragraphs: generalGovernanceParagraphs,
      download: corporateGovernanceDownload,
    },
    keyFeatures: {
      description:
        "Enhanced reporting, clearer disclosures and greater accessibility make it easier to explore Haycarb\u2019s performance, governance, sustainability and progress during the year.",
      items: [
        {
          icon: "sustainability",
          title: "Sustainability Reporting Enhancements",
          detail:
            "Early adoption of GRI 102 & 103 (Energy & Emissions Standards) and expanded disclosures on SLFRS S1 & S2 with independent assurance",
        },
        {
          icon: "financial",
          title: "Financial Reporting Improvements",
          detail:
            "Early adoption of SLFRS 18 with improved presentation and expanded disclosures",
        },
        {
          icon: "governance",
          title: "Corporate Governance Presentation",
          detail:
            "More visual, streamlined corporate governance reporting",
        },
        {
          icon: "accessibility",
          title: "Accessibility Advancements",
          detail:
            "Braille reporting and sign language, integrated video content",
        },
      ],
    },
    strategyImage: {
      title: "Our Strategic Levers for Sustainable Growth",
      image: "/images/innerpage/user-profile/general_users.webp",
      caption:
        "Guiding our path forward through focused priorities that strengthen resilience, drive innovation and create sustainable long term value.",
    },
    aiReportText:
      "Taking reporting beyond disclosure, our AI-enabled digital experience makes it easier to discover relevant information, explore deeper insights and engage with Haycarb\u2019s story in a more personalised way.",
  },
];
