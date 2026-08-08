import { TARGETS, GLOBAL_COUNTS, STATUS_COLORS } from "@/data/activateDashboard";

const cards = [
  {
    icon: "◎",
    label: "Total commitments",
    value: TARGETS.length,
    note: "Across 5 ACTIVATE pillars",
    color: "#087F8E",
    tint: "#E5F4F5",
  },
  {
    icon: "✓",
    label: "Achieved / maintained",
    value: GLOBAL_COUNTS["Achieved / exceeded"],
    note: "Targets met or maintained",
    color: STATUS_COLORS["Achieved / exceeded"],
    tint: "#E7F4EC",
  },
  {
    icon: "↗",
    label: "On track / progressing",
    value: GLOBAL_COUNTS["On track"] + GLOBAL_COUNTS["Progressing"],
    note: "Moving toward 2030",
    color: STATUS_COLORS["On track"],
    tint: "#E5F4F4",
  },
  {
    icon: "!",
    label: "Requires acceleration",
    value: GLOBAL_COUNTS["Requires acceleration"],
    note: "Further action required",
    color: STATUS_COLORS["Requires acceleration"],
    tint: "#FFF0E4",
  },
];

export default function SummaryCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
      {cards.map((c) => (
        <article
          key={c.label}
          className="bg-white border border-[#DDE5EB] rounded-[14px] p-3.5 flex items-center gap-3 shadow-[0_5px_15px_rgba(15,39,76,.045)]"
        >
          <div
            className="w-11 h-11 rounded-full grid place-items-center shrink-0 text-xl font-black"
            style={{ backgroundColor: c.tint, color: c.color }}
          >
            {c.icon}
          </div>
          <div>
            <div className="text-[11px] font-[850] text-[#253148]">
              {c.label}
            </div>
            <div
              className="text-[27px] font-black leading-none mt-0.5"
              style={{ color: c.color }}
            >
              {c.value}
            </div>
            <div className="text-[9.5px] text-[#667085]">{c.note}</div>
          </div>
        </article>
      ))}
    </section>
  );
}
