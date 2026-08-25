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
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'short',       label: 'Short' }
];

// Rotating messages for the thinking state
export const THINKING_MESSAGES = [
  'Reading the annual report…',
  'Looking through the figures…',
  'Putting it together…'
];

// Suggested questions per role. Currently identical across roles —
// client may want role-specific prompts later.
const DEFAULT_SUGGESTIONS = [
  "What were the chairman's key highlights?",
  'Show me the revenue trend as a chart',
  "What is Haycarb's sustainability strategy?",
  'Who are the board of directors?'
];

export const SUGGESTIONS = {
  general:     DEFAULT_SUGGESTIONS,
  shareholder: DEFAULT_SUGGESTIONS,
  employee:    DEFAULT_SUGGESTIONS,
  customer:    DEFAULT_SUGGESTIONS,
  supplier:    DEFAULT_SUGGESTIONS
};

export const getSuggestions = (role) =>
  SUGGESTIONS[role] ?? DEFAULT_SUGGESTIONS;

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
