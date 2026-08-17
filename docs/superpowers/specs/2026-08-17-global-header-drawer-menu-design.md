# GlobalHeader & Animated Fullscreen Drawer Menu

## Overview

Implement a global header component with a custom animated hamburger toggle and a fullscreen drawer menu. The menu provides navigation across the application with a premium editorial aesthetic, matching the existing glassmorphism design system.

## Scope

- New file: `src/components/GlobalHeader.tsx`
- Modified file: `src/app/layout.tsx` (add `<GlobalHeader />` to body)
- No new tokens or CSS files required — uses existing design tokens

## Component: GlobalHeader

**Type:** `"use client"` (requires `useState`, `useEffect`, `usePathname`)

### 1. Hamburger Toggle Button

**Position:** `fixed top-6 left-6 z-[100]`

**Structure:** Custom `<button>` wrapping three `<span>` elements.

**Closed state (menu hidden):**
- Three horizontal white lines: 28px wide, 2px tall, 6px gap between them
- Each line is a `block` with `bg-white rounded-full`

**Open state (menu visible):**
- Top line: `rotate-45` (transforms to diagonal)
- Middle line: `opacity-0` (fades out)
- Bottom line: `-rotate-45` (transforms to opposite diagonal)

**Transitions:** `transition-all duration-500 ease-in-out` on each span. Use `transform-origin: center` for smooth rotation.

**Button styling:** `bg-transparent hover:bg-white/10 rounded-full p-3 transition-colors duration-300` for comfortable tap targets.

### 2. Drawer Menu Overlay

**Container:** `fixed inset-0 z-50 pointer-events-none` (when closed)

**Background:** `bg-slate-900/95 backdrop-blur-3xl` — dark glassmorphism consistent with project theme.

**Desktop animation (md and up):**
- Closed: `translate-y-full` (slides off-screen upward, pushed down by full height)
- Open: `translate-y-0`
- Transition: `transition-transform duration-700 ease-in-out`

**Mobile animation (below md):**
- Closed: `-translate-x-full` (slides off-screen to the left)
- Open: `translate-x-0`
- Transition: `transition-transform duration-700 ease-in-out`

**Pointer events:** `pointer-events-none` when closed, `pointer-events-auto` when open (prevents accidental clicks on hidden menu).

### 3. Menu Content Layout

**Container:** `flex flex-col justify-center h-full pl-12 sm:pl-20` — left-aligned with generous padding for editorial feel.

**Menu links (data array):**
```js
const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Charts & Reports Generator", path: "/tailor-made-for-you" },
  { name: "FinQuest Game", path: "/puzzle" },
  { name: "User Profiles", path: "/user-profile-v2" },
];
```

**Link styling:**
- `font-sans text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight`
- Hover: `hover:text-brand-main transition-colors duration-300`
- Each link is a Next.js `<Link>` component

**Active state:**
- Use `usePathname()` from `next/navigation`
- If `pathname === link.path`, render an inline SVG arrow (rightward-pointing, similar to `→`) after the text
- Arrow: `ml-4 inline-block w-6 h-6 text-brand-main`

### 4. Scroll Lock & UX

**Scroll lock:**
- `useEffect` watching `isOpen` state
- When `isOpen === true`: set `document.body.style.overflow = 'hidden'`
- When `isOpen === false`: set `document.body.style.overflow = ''`
- Cleanup on unmount: revert to `''`

**Auto-close on navigation:**
- Each `<Link>` onClick calls `setIsOpen(false)`
- Menu slides closed, user sees the new page

**ESC key:**
- Additional `useEffect` listening for `keydown` event
- If `event.key === 'Escape'` and `isOpen === true`, close menu

### 5. State

Single `useState<boolean>` for `isOpen`:
```js
const [isOpen, setIsOpen] = useState(false);
const pathname = usePathname();
```

### 6. Integration

**In `src/app/layout.tsx`:**
```tsx
import GlobalHeader from "@/components/GlobalHeader";

export default function RootLayout({ children }) {
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

The component renders fixed-position elements, so it does not affect page layout flow.

## Design Tokens Used

- `bg-slate-900/95` — dark overlay (raw Tailwind, not tokenised — conditional state)
- `backdrop-blur-3xl` — glassmorphism blur
- `text-brand-main` — active arrow color (from `--color-brand-main`)
- `hover:text-brand-main` — link hover color
- `font-sans` — body font (Avenir)
- `bg-white/10` — button hover (raw value for interactive state)

## Exceptions to Token Rule

Per AGENTS.md, the following use raw Tailwind values:
- `bg-slate-900/95` — conditional overlay state, not core UI surface
- `bg-white/10` — interactive hover state
- `text-white` — content-on-dark-overlay (inverse content)

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/GlobalHeader.tsx` | Create — full component |
| `src/app/layout.tsx` | Edit — add `<GlobalHeader />` import and render |
