# Persona Tabs Glassmorphism & Mouse-Tracking Effects

**Date:** 2026-08-16
**Status:** Approved
**Scope:** Visual restyling of UserProfileTabsV2 + cursor aura effect on UserProfilePageV2

---

## 1. Objective

Apply a glassmorphism design system with advanced mouse-tracking hover effects to the User Profile V2 persona tabs, using Tailwind CSS v4 tokenized colors and zero-Rerender React interactions.

## 2. Constraints

- No changes to existing DOM structure, ARIA attributes, `useRef`, or keyboard navigation
- All colors must be tokenized via Tailwind CSS v4 `@theme` — no hardcoded hex/rgba in JSX
- Performance: 60fps animations with zero React re-renders from mouse tracking
- Do not change font styles/families (already configured)

## 3. Files Modified

| File | Change |
|------|--------|
| `src/styles/tokens/colors.css` | Append 18 new `@theme` color tokens |
| `src/components/UserProfileV2/UserProfileTabsV2.tsx` | Add `onMouseMove` spotlight handler, update tokenized classNames |
| `src/components/UserProfileV2/UserProfilePageV2.tsx` | Add `useEffect` for global cursor aura listener + aura `<div>` |
| `src/app/globals.css` | Add `.persona-spotlight::before` and `.cursor-aura` CSS rules |

## 4. Token Mapping (colors.css)

### Base Colors
- `--color-forest: #036984`
- `--color-teal: #1683a0`
- `--color-lime: #b8d65c`
- `--color-teal-2: #5bb2c8`
- `--color-gold: #e0b44b`
- `--color-mint: #e9f5f8`
- `--color-ink: #15332f`

### Glass Surfaces
- `--color-glass: rgba(2, 44, 59, 0.72)`
- `--color-glass-strong: rgba(1, 34, 46, 0.80)`
- `--color-glass-soft: rgba(2, 44, 59, 0.62)`
- `--color-glass-border: rgba(220, 242, 248, 0.22)`

### Tab State Colors
- `--color-tab-default: rgba(2, 44, 59, 0.64)`
- `--color-tab-hover: rgba(3, 105, 132, 0.44)`
- `--color-tab-hover-border: rgba(199, 237, 246, 0.52)`
- `--color-tab-active: rgba(3, 105, 132, 0.76)`
- `--color-tab-active-border: rgba(199, 237, 246, 0.68)`

### Effect Colors
- `--color-spotlight-center: rgba(183, 235, 248, 0.13)`
- `--color-spotlight-mid: rgba(183, 235, 248, 0.035)`
- `--color-aura-center: rgba(122, 214, 238, 0.12)`
- `--color-aura-mid: rgba(3, 105, 132, 0.055)`

## 5. Interaction Design

### 5a. Card Spotlight (Per-Tab)
- Each `<button>` has `onMouseMove` handler
- Calculates relative position: `(clientX - rect.left) / rect.width * 100` for `--spot-x`, same for `--spot-y`
- Sets variables directly on `e.currentTarget.style` — no React state
- `.persona-spotlight::before` renders a radial gradient using `--spot-x`/`--spot-y`
- Gradient: spotlight-center → spotlight-mid (38%) → transparent (72%)
- Visible on hover via `opacity` transition

### 5b. Cursor Aura (Global)
- `useEffect` attaches passive `mousemove` listener to `document`
- Updates `--pointer-x`/`--pointer-y` on `document.documentElement.style`
- No React state, no re-renders
- Fixed `<div>` with class `cursor-aura` renders radial gradient
- Gradient: aura-center → aura-mid (34%) → transparent (70%)
- `mix-blend-screen` for light-on-dark compositing

## 6. Tab State Classes

### Default
- `bg-tab-default border border-glass-border text-slate-300`

### Hover
- `hover:-translate-y-0.5 hover:bg-tab-hover hover:border-tab-hover-border`
- Spotlight `::before` visible via `group-hover:before:opacity-100`

### Active
- `bg-tab-active border-tab-active-border`
- `shadow-[0_10px_28px_rgba(0,30,42,0.22)]`
- Spotlight always visible

## 7. Testing

- Verify all 5 tabs render with correct default/hover/active states
- Verify spotlight follows mouse position within each tab on hover
- Verify cursor aura follows mouse across the full viewport
- Verify no React re-renders during mouse movement (React DevTools Profiler)
- Verify keyboard navigation (ArrowLeft/Right, Home/End) still works
- Verify ARIA attributes unchanged
- Run `pnpm build` — zero TypeScript errors, zero lint warnings
