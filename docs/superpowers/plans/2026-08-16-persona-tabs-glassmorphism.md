# Persona Tabs Glassmorphism & Mouse-Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply tokenized glassmorphism styling and 60fps mouse-tracking hover effects to the User Profile V2 persona tabs and global cursor aura.

**Architecture:** Tailwind CSS v4 `@theme` tokens in `colors.css` provide all color values. `UserProfileTabsV2.tsx` gets per-tab spotlight tracking via `onMouseMove`. `UserProfilePageV2.tsx` gets a global cursor aura via passive `document.mousemove` listener. CSS pseudo-elements render both effects.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, React 19

## Global Constraints

- No changes to existing DOM structure, ARIA attributes, `useRef`, or keyboard navigation
- All colors tokenized via Tailwind CSS v4 `@theme` — zero hardcoded hex/rgba in JSX
- Performance: 60fps animations with zero React re-renders from mouse tracking
- Do not change font styles/families (already configured)
- Build must pass with zero TypeScript errors and zero lint warnings

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/styles/tokens/colors.css` | Append 18 new `@theme` color tokens (base, glass, tab state, effect) |
| `src/app/globals.css` | Add `.persona-spotlight::before` and `.cursor-aura` CSS rules |
| `src/components/UserProfileV2/UserProfileTabsV2.tsx` | Add `onMouseMove` spotlight handler, update tokenized classNames |
| `src/components/UserProfileV2/UserProfilePageV2.tsx` | Add `useEffect` for global cursor aura listener + aura `<div>` |

---

### Task 1: Tokenize Color Palette in `colors.css`

**Files:**
- Modify: `src/styles/tokens/colors.css:1-31`

**Interfaces:**
- Consumes: existing `@theme` block (preserved)
- Produces: 18 new CSS custom properties available as Tailwind utilities (`bg-forest`, `border-glass-border`, etc.)

- [ ] **Step 1: Append new tokens to the existing `@theme` block**

Add the following lines inside the existing `@theme { ... }` block, after the chart series colors:

```css
/* --- PERSONA TAB THEME COLORS --- */
--color-forest: #036984;
--color-teal: #1683a0;
--color-lime: #b8d65c;
--color-teal-2: #5bb2c8;
--color-gold: #e0b44b;
--color-mint: #e9f5f8;
--color-ink: #15332f;

/* --- GLASS SURFACES --- */
--color-glass: rgba(2, 44, 59, 0.72);
--color-glass-strong: rgba(1, 34, 46, 0.80);
--color-glass-soft: rgba(2, 44, 59, 0.62);
--color-glass-border: rgba(220, 242, 248, 0.22);

/* --- TAB STATE COLORS --- */
--color-tab-default: rgba(2, 44, 59, 0.64);
--color-tab-hover: rgba(3, 105, 132, 0.44);
--color-tab-hover-border: rgba(199, 237, 246, 0.52);
--color-tab-active: rgba(3, 105, 132, 0.76);
--color-tab-active-border: rgba(199, 237, 246, 0.68);

/* --- EFFECT COLORS --- */
--color-spotlight-center: rgba(183, 235, 248, 0.13);
--color-spotlight-mid: rgba(183, 235, 248, 0.035);
--color-aura-center: rgba(122, 214, 238, 0.12);
--color-aura-mid: rgba(3, 105, 132, 0.055);
```

- [ ] **Step 2: Verify token generation**

Run: `pnpm build`
Expected: Build succeeds. Tailwind v4 generates utilities like `bg-forest`, `bg-tab-default`, `border-glass-border` from the `@theme` block.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/colors.css
git commit -m "feat: add persona tab glassmorphism color tokens to @theme"
```

---

### Task 2: Add Spotlight and Aura CSS Rules to `globals.css`

**Files:**
- Modify: `src/app/globals.css:186` (append after last rule)

**Interfaces:**
- Consumes: CSS custom properties from Task 1 (`--color-spotlight-center`, `--color-aura-center`, etc.)
- Produces: `.persona-spotlight` and `.cursor-aura` CSS classes usable in components

- [ ] **Step 1: Append spotlight pseudo-element CSS**

Add after the `.custom-scrollbar::-webkit-scrollbar-thumb:hover` rule:

```css
/* --- Persona Tab Spotlight Effect --- */
.persona-spotlight {
  position: relative;
}

.persona-spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--spot-x, 50%) var(--spot-y, 50%),
    var(--color-spotlight-center) 0%,
    var(--color-spotlight-mid) 38%,
    transparent 72%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.persona-spotlight:hover::before {
  opacity: 1;
}

/* --- Global Cursor Aura Effect --- */
.cursor-aura {
  background: radial-gradient(
    600px circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    var(--color-aura-center) 0%,
    var(--color-aura-mid) 34%,
    rgba(3, 105, 132, 0) 70%
  );
}
```

- [ ] **Step 2: Verify CSS compiles**

Run: `pnpm build`
Expected: Build succeeds with no CSS errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add persona-spotlight and cursor-aura CSS rules"
```

---

### Task 3: Update `UserProfileTabsV2.tsx` with Spotlight Handler and Tokenized Classes

**Files:**
- Modify: `src/components/UserProfileV2/UserProfileTabsV2.tsx:1-103`

**Interfaces:**
- Consumes: CSS classes `.persona-spotlight` from Task 2, tokenized utilities from Task 1
- Produces: tabs with mouse-tracking spotlight effect and glassmorphism styling

- [ ] **Step 1: Add the spotlight `onMouseMove` handler**

Inside the component, after the `handleKeyDown` callback, add:

```typescript
const handleSpotlightMove = useCallback(
  (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--spot-x", `${x}%`);
    e.currentTarget.style.setProperty("--spot-y", `${y}%`);
  },
  []
);
```

- [ ] **Step 2: Update the `<button>` className and add event handler**

Replace the existing `<button>` `className` and add `onMouseMove`:

```tsx
<button
  key={tab.id}
  ref={(el) => {
    tabRefs.current[index] = el;
  }}
  role="tab"
  id={`tab-${tab.id}`}
  aria-selected={isActive}
  aria-controls={`panel-${tab.id}`}
  tabIndex={isActive ? 0 : -1}
  onClick={() => onTabChange(tab.id)}
  onKeyDown={(e) => handleKeyDown(e, index)}
  onMouseMove={handleSpotlightMove}
  className={`group relative flex shrink-0 snap-start cursor-pointer flex-col items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-center transition-all duration-300 persona-spotlight rounded-lg border ${
    isActive
      ? "bg-tab-active border-tab-active-border shadow-[0_10px_28px_rgba(0,30,42,0.22)] opacity-100"
      : "bg-tab-default border-glass-border opacity-50 hover:-translate-y-0.5 hover:bg-tab-hover hover:border-tab-hover-border hover:opacity-100"
  } focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
>
```

- [ ] **Step 3: Update the `<span>` text color classes**

Replace the existing text `<span>` className:

```tsx
<span
  className={`text-[10px] md:text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
    isActive ? "text-white" : "text-slate-300 group-hover:text-white"
  }`}
>
```

- [ ] **Step 4: Verify component builds**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/UserProfileV2/UserProfileTabsV2.tsx
git commit -m "feat: add spotlight mouse-tracking and glassmorphism classes to tabs"
```

---

### Task 4: Add Cursor Aura to `UserProfilePageV2.tsx`

**Files:**
- Modify: `src/components/UserProfileV2/UserProfilePageV2.tsx:1-278`

**Interfaces:**
- Consumes: CSS class `.cursor-aura` from Task 2
- Produces: global cursor aura effect following mouse across viewport

- [ ] **Step 1: Add `useEffect` for passive mousemove listener**

Inside the component, after the existing `useEffect` blocks (after line 138), add:

```typescript
useEffect(() => {
  const handlePointerMove = (e: MouseEvent) => {
    document.documentElement.style.setProperty("--pointer-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${e.clientY}px`);
  };

  document.addEventListener("mousemove", handlePointerMove, { passive: true });
  return () => document.removeEventListener("mousemove", handlePointerMove);
}, []);
```

- [ ] **Step 2: Add the aura `<div>` to the JSX**

Inside the `<main>` tag, after `<UserProfileBackgroundScrubber />` (after line 145), add:

```tsx
{/* CURSOR AURA */}
<div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 z-[90] cursor-aura"
/>
```

- [ ] **Step 3: Verify component builds**

Run: `pnpm build`
Expected: Build succeeds with zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/UserProfileV2/UserProfilePageV2.tsx
git commit -m "feat: add global cursor aura effect to UserProfilePageV2"
```

---

### Task 5: Final Verification

**Files:** None (verification only)

- [ ] **Step 1: Full build check**

Run: `pnpm build`
Expected: Zero errors, zero warnings.

- [ ] **Step 2: Visual verification checklist**

Verify in browser:
- [ ] All 5 tabs render with dark glass background (default state)
- [ ] Hovering a tab lifts it 2px, changes background to teal, brightens border
- [ ] Active tab has distinct brighter background, bright border, and box-shadow
- [ ] Spotlight glow follows mouse position inside each tab on hover
- [ ] Cursor aura follows mouse across the full viewport
- [ ] Arrow key navigation between tabs works
- [ ] ARIA attributes are unchanged (inspect via DevTools)

- [ ] **Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: minor adjustments from visual verification"
```

---

## Self-Review

1. **Spec coverage:** Token mapping (Task 1), CSS rules (Task 2), tab styling + spotlight (Task 3), cursor aura (Task 4), verification (Task 5) — all spec sections covered.
2. **Placeholder scan:** No TBDs, TODOs, or vague steps. All code blocks are complete.
3. **Type consistency:** `handleSpotlightMove` uses `React.MouseEvent<HTMLButtonElement>`, matching the `<button>` element. `handlePointerMove` uses `MouseEvent`, matching `document.addEventListener`. CSS custom property names (`--spot-x`, `--spot-y`, `--pointer-x`, `--pointer-y`) are consistent between JS and CSS.
