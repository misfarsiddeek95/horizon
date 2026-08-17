# GlobalHeader & Animated Fullscreen Drawer Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global animated hamburger menu with fullscreen drawer navigation to all pages.

**Architecture:** Single `"use client"` component (`GlobalHeader.tsx`) with a custom 3-line morph toggle button and a responsive fullscreen drawer. Desktop: slide-down from top. Mobile: slide-in from left. Integrated via root layout.

**Tech Stack:** React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4

## Global Constraints

- All styling uses project design tokens where applicable (see `src/styles/tokens/`)
- Raw Tailwind values allowed only for conditional/interactive states (per AGENTS.md token exceptions)
- No comments in production code
- No `any` types
- Build must pass with zero TypeScript errors and zero lint warnings
- Next.js 16 — read `node_modules/next/dist/docs/` if unsure about APIs

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/GlobalHeader.tsx` | Create | Hamburger toggle, drawer overlay, scroll lock, navigation links |
| `src/app/layout.tsx` | Edit | Add `<GlobalHeader />` to body |

---

### Task 1: Create GlobalHeader component

**Files:**
- Create: `src/components/GlobalHeader.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation`, `Link` from `next/link`
- Produces: `default export GlobalHeader` — a React client component

- [ ] **Step 1: Create the component file**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Charts & Reports Generator", path: "/tailor-made-for-you" },
  { name: "FinQuest Game", path: "/puzzle" },
  { name: "User Profiles", path: "/user-profile-v2" },
];

export default function GlobalHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[100] bg-transparent hover:bg-white/10 rounded-full p-3 transition-colors duration-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="flex flex-col justify-center items-center w-7 h-7 gap-1.5">
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </span>
      </button>

      <nav
        className={`fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-3xl transition-transform duration-700 ease-in-out ${
          isOpen
            ? "translate-y-0 md:translate-y-0 translate-x-0"
            : "-translate-y-full md:-translate-y-full -translate-x-full"
        } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="flex flex-col justify-center h-full pl-12 sm:pl-20">
          {menuLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={handleLinkClick}
              className="group py-3 font-sans text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight hover:text-brand-main transition-colors duration-300"
            >
              {link.name}
              {pathname === link.path && (
                <span className="ml-4 inline-block">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-brand-main"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors.

- [ ] **Step 3: Verify lint passes**

Run: `pnpm lint`
Expected: No lint warnings or errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/GlobalHeader.tsx
git commit -m "feat: add GlobalHeader with animated hamburger and fullscreen drawer"
```

---

### Task 2: Integrate GlobalHeader into layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `GlobalHeader` from `@/components/GlobalHeader`
- Produces: Updated root layout with header rendered on all pages

- [ ] **Step 1: Add import and render**

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors.

- [ ] **Step 3: Verify lint passes**

Run: `pnpm lint`
Expected: No lint warnings or errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: integrate GlobalHeader into root layout"
```

---

### Task 3: Manual verification

- [ ] **Step 1: Run dev server**

Run: `pnpm dev`
Expected: App starts on localhost:3000

- [ ] **Step 2: Verify hamburger button**
  - Button appears fixed at top-left
  - Three horizontal white lines visible on all pages
  - Clicking button opens menu (lines morph to X)

- [ ] **Step 3: Verify drawer animations**
  - Desktop (md+): menu slides down from top with 700ms transition
  - Mobile (below md): menu slides in from left with 700ms transition
  - Background is dark glassmorphism (slate-900/95 + backdrop-blur)

- [ ] **Step 4: Verify navigation links**
  - All 4 links render with large bold white text
  - Hover changes text to brand-main color
  - Active page shows arrow indicator next to its link
  - Clicking a link closes the menu and navigates

- [ ] **Step 5: Verify scroll lock**
  - When menu is open, page behind does not scroll
  - When menu closes, scrolling resumes
  - Pressing ESC closes the menu
