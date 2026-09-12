import type { Metadata } from "next";
import PuzzleGameView from "./PuzzleGameView";

export const metadata: Metadata = {
  title: { absolute: "Haycarb Annual Report 2025/26 | Gamified Exploration" },
  description: "Explore Haycarb’s Annual Report 2025/26 through an interactive challenge designed to make discovering key facts, insights and achievements more engaging.",
};

export default function PuzzlePage() {
  return <PuzzleGameView />;
}
