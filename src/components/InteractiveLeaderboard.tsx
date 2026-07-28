"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { TrophyIcon, CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { LeaderboardEntry } from "@/types";
import { CATEGORY_COLORS, getAllCategories } from "@/data/config";

const ALL_CATEGORIES = getAllCategories();

export default function InteractiveLeaderboard({
  players,
}: {
  players: LeaderboardEntry[];
}) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedPlayer = selectedEmail
    ? players.find((p) => p.email === selectedEmail)
    : null;

  function handleClose() {
    setSelectedEmail(null);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {players.length === 0 && (
          <p className="text-center text-white/60 py-8">
            No scores yet. Play a game to appear here!
          </p>
        )}

        {players.map((player, i) => {
          const rank = i + 1;
          const isSelected = selectedEmail === player.email;

          let rowClasses =
            "flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer";
          if (isSelected) {
            rowClasses += " ring-2 ring-white/40";
          }

          let rankIcon: React.ReactNode;
          let nameClasses = "text-white/85";
          let scoreClasses = "text-white";

          if (rank === 1) {
            rowClasses += " bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50";
            nameClasses = "text-xl font-extrabold text-white";
            scoreClasses = "text-xl font-extrabold text-yellow-300";
            rankIcon = <TrophyIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />;
          } else if (rank === 2) {
            rowClasses += " bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/50";
            nameClasses = "text-lg font-bold text-white";
            scoreClasses = "text-lg font-bold text-white/85";
            rankIcon = <TrophyIcon className="w-7 h-7 text-white/80 flex-shrink-0" />;
          } else if (rank === 3) {
            rowClasses += " bg-gradient-to-r from-amber-700/20 to-transparent border-amber-700/50";
            nameClasses = "text-lg font-bold text-white";
            scoreClasses = "text-lg font-bold text-amber-300";
            rankIcon = <TrophyIcon className="w-6 h-6 text-amber-300 flex-shrink-0" />;
          } else {
            rankIcon = <span className="w-8 text-center text-white/50 text-sm">{rank}</span>;
          }

          return (
            <div
              key={player.email}
              className={rowClasses}
              onClick={() => setSelectedEmail(isSelected ? null : player.email)}
            >
              <div className="flex items-center gap-4 min-w-0">
                {rankIcon}
                <span className={`truncate ${nameClasses}`}>{player.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={scoreClasses}>{player.score} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {mounted && selectedPlayer && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-lg mt-10 mb-10 rounded-ui-card bg-surface-default p-6 shadow-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="mb-6 text-center">
              <h2 className="font-heading text-xl font-bold text-content-primary">
                {selectedPlayer.name}
              </h2>
              <p className="mt-1 text-3xl font-bold text-brand-main">
                {selectedPlayer.score} pts
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-primary/40">
                Certifications Earned
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.filter((c) => selectedPlayer.earnedBadges[c]).length === 0 ? (
                  <p className="text-sm text-content-primary/50">No certifications earned</p>
                ) : (
                  ALL_CATEGORIES.filter((c) => selectedPlayer.earnedBadges[c]).map((cat) => (
                    <span
                      key={cat}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[cat]?.card ?? "bg-zinc-100 text-zinc-700"}`}
                    >
                      <CheckBadgeIcon className="h-3.5 w-3.5" />
                      {cat}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-content-primary/40">
                Score Breakdown
              </h3>
              {selectedPlayer.answerHistory.length === 0 ? (
                <p className="text-sm text-content-primary/50">No breakdown data available</p>
              ) : (
                <div className="space-y-2">
                  {selectedPlayer.answerHistory.map((record, idx) => (
                    <div
                      key={record.questionId}
                      className={`rounded-md bg-zinc-50 p-3 text-xs ${
                        record.status === "failed" || record.status === "timeout"
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-content-primary/60">
                          #{idx + 1}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            record.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : record.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                      <p className="mb-1 font-medium text-content-primary truncate">
                        {record.clue}
                      </p>
                      <p className="text-content-primary/60">
                        <span className="font-mono">{record.basePoints}</span>{" "}
                        (Base)
                        {record.status === "completed" && (
                          <>
                            {" + "}
                            <span className="font-mono">{record.timeBonus}</span>{" "}
                            (Time)
                          </>
                        )}
                        {record.aiUsed && (
                          <>
                            {" "}
                            <span className="inline-flex items-center rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">
                              AI -50%
                            </span>
                          </>
                        )}
                        {" = "}
                        <span className="font-mono font-bold text-content-primary">
                          {record.totalPointsEarned}
                        </span>{" "}
                        pts
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
