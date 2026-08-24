interface ClimateChartProps {
  title: string;
  upperVals: [number, number, number];
  lowerVals: [number, number, number];
  isPercent?: boolean;
}

const XS = [55, 190, 325] as const;
const HORIZONS = ["ST", "MT", "LT"] as const;

export default function ClimateChart({
  title,
  upperVals,
  lowerVals,
  isPercent = false,
}: ClimateChartProps) {
  const max = Math.max(...upperVals) * 1.15;
  const y = (v: number) => 190 - (v / max) * 145;

  const upperPoints = upperVals.map((v, i) => `${XS[i]},${y(v)}`).join(" ");
  const lowerPoints = lowerVals.map((v, i) => `${XS[i]},${y(v)}`).join(" ");
  const areaPoints = [
    `${XS[0]},${y(upperVals[0])}`,
    `${XS[1]},${y(upperVals[1])}`,
    `${XS[2]},${y(upperVals[2])}`,
    `${XS[2]},${y(lowerVals[2])}`,
    `${XS[1]},${y(lowerVals[1])}`,
    `${XS[0]},${y(lowerVals[0])}`,
  ].join(" ");

  const label = /Cost|Revenue/.test(title) ? "Financial effect" : "Driver";

  return (
    <div className="rounded-[18px_18px_18px_6px] border border-[var(--color-v2-border)] bg-surface-default px-[22px] pb-[18px] pt-[22px]">
      <div className="text-[10px] uppercase tracking-[0.08em] font-black text-[var(--color-v2-label)]">
        {label}
      </div>
      <h4 className="mt-[7px] mb-[2px] text-[15px] leading-[1.35]">{title}</h4>
      <p className="m-0 mb-2 text-[11px] text-[var(--color-v2-text-faint)]">
        ST · MT · LT scenario range
      </p>
      <svg
        viewBox="0 0 380 235"
        role="img"
        aria-label={title}
        className="block h-auto w-full"
      >
        <line x1="45" y1="190" x2="345" y2="190" stroke="#cbd8d6" />
        <line x1="45" y1="145" x2="345" y2="145" stroke="#e6eceb" />
        <line x1="45" y1="100" x2="345" y2="100" stroke="#e6eceb" />
        <line x1="45" y1="55" x2="345" y2="55" stroke="#e6eceb" />
        <polygon
          points={areaPoints}
          fill="var(--color-v2-wash-chart)"
          opacity=".85"
        />
        <polyline
          points={upperPoints}
          fill="none"
          stroke="var(--color-v2-series-upper)"
          strokeWidth="3"
        />
        <polyline
          points={lowerPoints}
          fill="none"
          stroke="var(--color-v2-series-lower)"
          strokeWidth="3"
        />
        {XS.map((x, i) => (
          <g key={HORIZONS[i]}>
            <circle cx={x} cy={y(upperVals[i])} r="4" fill="var(--color-v2-series-upper)" />
            <circle cx={x} cy={y(lowerVals[i])} r="4" fill="var(--color-v2-series-lower)" />
            <text
              x={x}
              y="210"
              textAnchor="middle"
              fontSize="10"
              fill="#6b8088"
            >
              {HORIZONS[i]}
            </text>
            <text
              x={x}
              y={y(upperVals[i]) - 9}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="var(--color-v2-series-upper)"
            >
              {upperVals[i]}
              {isPercent ? "%" : ""}
            </text>
          </g>
        ))}
        <line
          x1="220"
          y1="224"
          x2="240"
          y2="224"
          stroke="var(--color-v2-series-upper)"
          strokeWidth="3"
        />
        <text x="245" y="228" fontSize="9" fill="#607780">
          Upper estimate
        </text>
        <line
          x1="70"
          y1="224"
          x2="90"
          y2="224"
          stroke="var(--color-v2-series-lower)"
          strokeWidth="3"
        />
        <text x="95" y="228" fontSize="9" fill="#607780">
          Lower estimate
        </text>
      </svg>
    </div>
  );
}
