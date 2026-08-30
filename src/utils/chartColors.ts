export function getChartColor(token: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

export const chartTokens = {
  tealBlue: "--color-tm-teal-blue",
  cyanTeal: "--color-tm-cyan-teal",
  amber: "--color-tm-amber",
  burntOrange: "--color-tm-burnt-orange",
  mint: "--color-tm-mint",
  paleYellow: "--color-tm-pale-yellow",
  lightBlue: "--color-tm-light-blue",
  bronze: "--color-tm-bronze",
} as const;
