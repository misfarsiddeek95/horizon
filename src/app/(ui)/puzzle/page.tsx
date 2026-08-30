import type { Metadata } from "next";
import PuzzleGameView from "./PuzzleGameView";

export const metadata: Metadata = {
  title: "Crossword Puzzle Game",
};

export default function PuzzlePage() {
  return <PuzzleGameView />;
}
