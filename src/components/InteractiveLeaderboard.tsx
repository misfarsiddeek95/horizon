"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { LeaderboardEntry } from "@/types";
import { CATEGORY_COLORS, getAllCategories } from "@/data/config";

const ALL_CATEGORIES = getAllCategories();

const EMPTY_SUBSCRIBE = () => () => {};

function readSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("horizon-puzzle-session");
    if (!raw) return null;
    return (JSON.parse(raw) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0]?.toUpperCase() ?? "";
  const second = parts[1]?.[0]?.toUpperCase() ?? "";
  return (first + second || "?").slice(0, 2);
}

interface PodiumStyle {
  orderClass: string;
  avatarSize: string;
  avatarText: string;
  snakeGradient: string;
  glowShadow: string;
  rippleClass: string;
  scoreClass: string;
}

const PODIUM_STYLES: Record<1 | 2 | 3, PodiumStyle> = {
  1: {
    orderClass: "order-2",
    avatarSize: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    avatarText: "text-2xl sm:text-3xl",
    snakeGradient:
      "bg-[conic-gradient(from_0deg,transparent_70%,rgba(250,204,21,1)_100%)]",
    glowShadow: "shadow-[0_0_25px_rgba(250,204,21,0.6)]",
    rippleClass: "bg-yellow-400 opacity-20 animate-[ping_3s_ease-out_infinite]",
    scoreClass: "text-yellow-300",
  },
  2: {
    orderClass: "order-1",
    avatarSize: "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    avatarText: "text-xl sm:text-2xl",
    snakeGradient:
      "bg-[conic-gradient(from_0deg,transparent_70%,rgba(203,213,225,1)_100%)]",
    glowShadow: "",
    rippleClass: "",
    scoreClass: "text-slate-300",
  },
  3: {
    orderClass: "order-3",
    avatarSize: "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    avatarText: "text-xl sm:text-2xl",
    snakeGradient:
      "bg-[conic-gradient(from_0deg,transparent_70%,rgba(217,119,6,1)_100%)]",
    glowShadow: "",
    rippleClass: "",
    scoreClass: "text-amber-500",
  },
};

export default function InteractiveLeaderboard({
  players,
}: {
  players: LeaderboardEntry[];
}) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false
  );

  const currentUserEmail = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    readSessionEmail,
    () => null
  );

  const sortedPlayers = useMemo(
    () =>
      [...players].sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [players]
  );

  const topThree = sortedPlayers.slice(0, 3);
  const remainingList = sortedPlayers.slice(3, 10);

  const currentUserIndex = sortedPlayers.findIndex(
    (p) => p.email === currentUserEmail
  );
  const currentUser =
    currentUserIndex >= 0 ? sortedPlayers[currentUserIndex] : null;
  const currentUserRank = currentUserIndex + 1;
  const showPinnedRow = currentUser !== null && currentUserRank > 10;

  const selectedPlayer = selectedEmail
    ? sortedPlayers.find((p) => p.email === selectedEmail)
    : null;

  function handleClose() {
    setSelectedEmail(null);
  }

  function renderRow(player: LeaderboardEntry, rank: number, pinned: boolean) {
    const isSelected = selectedEmail === player.email;
    const isCurrentUser = player.email === currentUserEmail;

    let rowClasses =
      "w-full min-w-0 flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]" +
      (isCurrentUser ? " cursor-pointer" : " cursor-default");
    if (isSelected) {
      rowClasses += " ring-2 ring-white/40";
    }
    if (pinned) {
      rowClasses += " mt-2 border-t-2 border-white/20";
    }

    return (
      <div
        key={player.email}
        className={rowClasses}
        onClick={
          isCurrentUser
            ? () => setSelectedEmail(isSelected ? null : player.email)
            : undefined
        }
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 font-bold text-white/90 border border-white/20">
            {rank}
          </span>
          <span className="min-w-0 flex-1 truncate text-white/85">{player.name}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white">{player.score} pts</span>
        </div>
      </div>
    );
  }

  function renderPodium() {
    if (topThree.length === 0) return null;

    return (
      <div className="flex justify-center items-end gap-2 sm:gap-3 md:gap-4 pt-12 md:pt-16 pb-6">
        {topThree.map((player, i) => {
          const rank = (i + 1) as 1 | 2 | 3;
          const isSelected = selectedEmail === player.email;
          const isCurrentUser = player.email === currentUserEmail;
          const podium = PODIUM_STYLES[rank];

          const columnClasses =
            "flex flex-col items-center" +
            (isCurrentUser ? " cursor-pointer" : " cursor-default");
          const snakeClasses =
            "relative z-10 overflow-hidden rounded-full transition-transform duration-300" +
            " " +
            podium.avatarSize +
            " " +
            podium.glowShadow +
            (isSelected ? " scale-105" : isCurrentUser ? " hover:scale-105" : "");

          return (
            <div
              key={player.email}
              className={`${columnClasses} ${podium.orderClass}`}
              onClick={
                isCurrentUser
                  ? () => setSelectedEmail(isSelected ? null : player.email)
                  : undefined
              }
            >
              <div className="relative">
                {podium.rippleClass && (
                  <span
                    className={`absolute inset-0 rounded-full pointer-events-none ${podium.rippleClass}`}
                    aria-hidden="true"
                  />
                )}
                <div className={snakeClasses}>
                  <span
                    className={`absolute inset-[-50%] ${podium.snakeGradient} animate-[spin_3s_linear_infinite]`}
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute inset-[4px] rounded-full z-10 flex items-center justify-center font-bold text-white select-none bg-brand-main ${podium.avatarText}`}
                  >
                    {initials(player.name)}
                  </div>
                </div>
                {rank === 1 && (
                  <span
                    className="absolute -top-8 sm:-top-10 md:-top-12 left-1/2 -translate-x-1/2 text-5xl sm:text-6xl md:text-7xl z-50"
                    aria-hidden="true"
                  >
                    👑
                  </span>
                )}
              </div>
              <span className="mt-4 block w-28 min-h-10 md:min-h-12 whitespace-normal break-words text-center font-bold tracking-wide text-xs sm:text-sm md:text-base text-white/85">
                {player.name}
              </span>
              <span
                className={`mt-1 text-base md:text-lg font-extrabold ${podium.scoreClass}`}
              >
                {player.score} pts
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 w-full max-w-full overflow-x-hidden">
        {sortedPlayers.length === 0 && (
          <p className="text-center text-white/60 py-8">
            No scores yet. Play a game to appear here!
          </p>
        )}

        {topThree.length > 0 && renderPodium()}

        {remainingList.map((player, i) => renderRow(player, i + 4, false))}

        {showPinnedRow &&
          currentUser &&
          renderRow(currentUser, currentUserRank, true)}
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
