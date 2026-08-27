/**
 * Colours are defined as CSS variables in the global stylesheet so the host
 * app can restyle in one place. Chart.js needs real values rather than CSS
 * classes, so we read them from the document at runtime.
 *
 * These are getters, not plain values — they must be read at render time,
 * after the stylesheet has loaded. Evaluating them at import time would
 * capture the fallbacks instead.
 */
function cssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;   // SSR
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim();
  return v || fallback;
}

export const COLORS = {
  get blueDeep()   { return cssVar('--hc-blue-deep',   '#0B5D73'); },
  get blueRich()   { return cssVar('--hc-blue-rich',   '#177E98'); },
  get blueSoft()   { return cssVar('--hc-blue-soft',   '#6DBED2'); },
  get bluePale()   { return cssVar('--hc-blue-pale',   '#DDEFF3'); },
  get blueSky()    { return cssVar('--hc-blue-sky',    '#3FA6C4'); },
  get orange()     { return cssVar('--hc-orange',      '#F29A58'); },
  get gold()       { return cssVar('--hc-gold',        '#F7C66A'); },
  get peach()      { return cssVar('--hc-peach',       '#E58C72'); },
  get mountain()   { return cssVar('--hc-mountain',    '#6A6575'); },
  get white()      { return cssVar('--hc-white',       '#F7F5F2'); },
  get bg()         { return cssVar('--hc-bg',          '#081F2B'); },
  get surface()    { return cssVar('--hc-surface',     '#0D2E3F'); },
  get surface2()   { return cssVar('--hc-surface-2',   '#113548'); },
  get chartLabel() { return cssVar('--hc-chart-label', '#177E98'); },
  get chartAxis()  { return cssVar('--hc-chart-axis',  '#5A93A8'); },
  get chartGrid()  { return cssVar('--hc-chart-grid',  'rgba(109,190,210,0.1)'); }
};

// NOTE: chart series colours are built inside ChartBlock.jsx rather than
// exported as an array here — an array would evaluate at import time and
// capture the fallback values before CSS has loaded.

export const ROLES = [
  { value: 'general',     label: 'General' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'employee',    label: 'Employee' },
  { value: 'customer',    label: 'Customer' },
  { value: 'supplier',    label: 'Supplier' }
];

export const ANSWER_STYLES = [
  { value: 'descriptive', label: 'Detailed' },
  { value: 'short',       label: 'Summarised' }
];

// Rotating messages for the thinking state
export const THINKING_MESSAGES = [
  'Reading the annual report…',
  'Looking through the figures…',
  'Putting it together…'
];

// Suggested questions per role.
const DEFAULT_SUGGESTIONS = [
  'How is the financial performance of Haycarb during the last 3 years',
  "Can you give a summary of Haycarb's sustainability strategy and its carbon emissions and emissions intensity performance during the last 3 years",
  "Can you summarise the key points in the Chairman's and Managing Director's joint statement",
  'What are the new features of the annual report 2025/26?'
];

const ROLE_SUGGESTIONS = {
  general: [
    'How did Haycarb perform in 2025/26 compared with the previous two years?',
    'Where does Haycarb operate globally, and what does its global footprint look like?',
    "What were Haycarb's biggest achievements and developments during the year?",
    'How is Haycarb creating value across financial, environmental and social areas?'
  ],
  shareholder: [
    "How have Haycarb's revenue, profitability and shareholder returns changed over the past three years?",
    "What drove Haycarb's financial performance in 2025/26 and which business segments contributed most?",
    'Where is Haycarb investing for future growth and what opportunities could shape its next phase of growth?',
    "What are the key risks and opportunities that could influence Haycarb's future performance?"
  ],
  employee: [
    'How is Haycarb investing in its people?',
    "What does Haycarb's workforce look like across its global operations?",
    'How is Haycarb progressing on diversity, employee development and workplace safety?',
    'How will digitalisation and AI change the way employees work at Haycarb?'
  ],
  customer: [
    'How is Haycarb innovating to meet emerging customer and industry needs?',
    'What solutions does Haycarb offer across its key applications and industries?',
    'How does Haycarb ensure product quality, technical excellence and reliable supply for customers globally?',
    'How is Haycarb responding to future opportunities in areas such as energy storage and environmental purification?'
  ],
  supplier: [
    'How is Haycarb strengthening its global supply chain and expanding its supplier network?',
    'How does Haycarb assess suppliers on quality, environmental and social performance?',
    'How is Haycarb helping suppliers transition towards more sustainable charcoaling practices?',
    "What opportunities does Haycarb's future growth create for its suppliers and supply partners?"
  ]
};

export const getSuggestions = (role) =>
  ROLE_SUGGESTIONS[role] ?? DEFAULT_SUGGESTIONS;

// Shown under each AI answer. Wording is likely to be reviewed by the
// client's IR/legal team — keep it easy to edit.
export const DISCLAIMER = {
  en: 'AI-generated from the Annual Report 2025/26. Please verify important figures against the report.',
  si: 'වාර්ෂික වාර්තාව 2025/26 ඇසුරින් AI මගින් සකසන ලදි. වැදගත් තොරතුරු වාර්තාව සමඟ තහවුරු කරගන්න.',
  ta: 'வருடாந்த அறிக்கை 2025/26 அடிப்படையில் AI மூலம் உருவாக்கப்பட்டது. முக்கிய தரவுகளை அறிக்கையுடன் சரிபார்க்கவும்.'
};

/** Sinhala U+0D80–U+0DFF, Tamil U+0B80–U+0BFF */
export function detectLang(text = '') {
  for (const c of text) {
    if (c >= '\u0D80' && c <= '\u0DFF') return 'si';
    if (c >= '\u0B80' && c <= '\u0BFF') return 'ta';
  }
  return 'en';
}
