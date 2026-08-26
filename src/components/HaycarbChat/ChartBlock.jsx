'use client';

import { useRef, useEffect } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { COLORS } from './constants';

// NOTE: registering ChartDataLabels here applies it to every Chart.js
// instance in the host app. If that's a problem, remove it from this
// call and pass plugins={[ChartDataLabels]} on the chart components below.
ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler,
  ChartDataLabels
);

/**
 * Renders one chart from the API's `charts` array.
 * Each chart holds one unit and one or more series.
 * Exposes its canvas via onCanvasReady so PDF export can capture it.
 */
export default function ChartBlock({ chart, onCanvasReady }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && onCanvasReady) {
      onCanvasReady(ref.current.canvas);
    }
  }, [onCanvasReady]);

  if (!chart?.series?.length) return null;

  // Read at render time so CSS variables have loaded
  const seriesColors = [
    COLORS.blueRich, COLORS.orange, COLORS.blueSoft,
    COLORS.gold, COLORS.peach, COLORS.blueSky
  ];

  // Union of categories across series, preserving first-seen order
  const labels = [];
  chart.series.forEach(s =>
    s.data.forEach(p => {
      if (!labels.includes(p.category)) labels.push(p.category);
    })
  );

  // Map each series onto the shared axis; missing points become null (gap, not zero)
  const datasets = chart.series.map((s, i) => {
    const color = seriesColors[i % seriesColors.length];
    return {
      label: s.name,
      data: labels.map(lbl => s.data.find(p => p.category === lbl)?.value ?? null),
      borderColor: color,
      backgroundColor: chart.type === 'line' ? `${color}33` : color,
      borderWidth: chart.type === 'line' ? 2 : 0,
      borderRadius: chart.type === 'bar' ? 6 : 0,
      pointBackgroundColor: color,
      tension: 0.3,
      fill: false,
      spanGaps: true
    };
  });

  const axisStyle = {
    ticks: { color: COLORS.chartAxis, font: { size: 11 } },
    grid:  { color: COLORS.chartGrid }
  };

  // Values printed on bars/points. Colour must read on the dark UI AND on a
  // white PDF page — the canvas is transparent when captured into the PDF.
  const dataLabels = {
    display: true,
    color: COLORS.chartLabel,
    font: { size: 10, weight: '600' },
    anchor: chart.type === 'bar' ? 'end' : 'center',
    align: 'top',
    offset: 6,
    formatter: (value) => {
      if (value === null) return '';
      // large numbers get thousands separators, small ones keep decimals
      return Math.abs(value) >= 1000
        ? value.toLocaleString()
        : value.toString();
    }
  };

  const tooltip = {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderStrong,
    borderWidth: 1,
    titleColor: COLORS.blueSoft,
    bodyColor: COLORS.bluePale,
    callbacks: chart.unit
      ? { label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue} ${chart.unit}` }
      : {}
  };

  const legend = chart.series.length > 1
    ? { position: 'bottom', labels: { color: COLORS.chartAxis, font: { size: 11 }, padding: 12, boxWidth: 12 } }
    : { display: false };

  // Pie uses only the first series
  if (chart.type === 'pie') {
    const first = chart.series[0];
    return (
      <Wrapper title={chart.title}>
        <Doughnut
          ref={ref}
          data={{
            labels: first.data.map(p => p.category),
            datasets: [{
              data: first.data.map(p => p.value),
              backgroundColor: seriesColors,
              borderWidth: 0,
              hoverOffset: 6
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: 2,
            animation: { duration: 600 },
            plugins: {
              legend: { position: 'bottom', labels: { color: COLORS.chartAxis, font: { size: 11 }, padding: 12 } },
              tooltip,
              // slices are usually too small for labels, and the legend names them
              datalabels: { display: false }
            }
          }}
        />
      </Wrapper>
    );
  }

  const ChartComponent = chart.type === 'line' ? Line : Bar;

  return (
    <Wrapper title={chart.title}>
      <ChartComponent
        ref={ref}
        data={{ labels, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          // 2x so charts stay sharp when captured into the PDF
          devicePixelRatio: 2,
          animation: { duration: 600 },
          layout: { padding: { top: 16 } },
          plugins: { legend, tooltip, datalabels: dataLabels },
          scales: {
            x: {
              ...axisStyle,
              // insets the data points so the first and last value labels
              // don't collide with the y-axis and the chart edge
              offset: true
            },
            y: {
              ...axisStyle,
              // headroom so labels above the tallest point aren't clipped
              grace: '15%',
              title: chart.unit
                ? { display: true, text: chart.unit, color: COLORS.chartAxis, font: { size: 10 } }
                : { display: false }
            }
          }
        }}
      />
    </Wrapper>
  );
}

function Wrapper({ title, children }) {
  return (
    <div className="mt-4 rounded-xl border border-white/40 bg-white/40 p-4 backdrop-blur-md">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-brand-main">
        {title}
      </div>
      <div className="h-[220px]">{children}</div>
    </div>
  );
}
