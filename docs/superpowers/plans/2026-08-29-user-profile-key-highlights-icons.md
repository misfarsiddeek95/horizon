# User Profile Key Highlights Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Key Highlights icons with the correct profile-specific SVG icons for Shareholders, Employees, Customers, and Suppliers while leaving General User unchanged.

**Architecture:** Keep icon URLs beside each profile's existing highlight copy in `PROFILE_TABS` through an optional `highlightIcons` field. Pass the active profile's icon list to the existing Key Highlights section and render each SVG by matching array index, with the current Heroicons as a per-item fallback.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript, `next/image`, public SVG assets.

## Global Constraints

- Use the supplied assets in `public/icons/user-profile/Key-highlights/<Profile>/`.
- Match icon order to the existing `highlights` array order.
- Leave General User without `highlightIcons` so its current behavior is unchanged.
- Preserve the existing Key Highlights layout, hover states, reveal animation, labels, and tab navigation.
- Do not add a runtime or network data source.
- Do not add a test dependency; verify with the repository's existing lint and build scripts.

---

### Task 1: Add Profile Icon Mappings

**Files:**
- Modify: `src/data/userProfiles.ts:23-56` for the `ProfileTab` interface.
- Modify: `src/data/userProfiles.ts:155-161` for Shareholders.
- Modify: `src/data/userProfiles.ts:213-218` for Employees.
- Modify: `src/data/userProfiles.ts:266-272` for Customers.
- Modify: `src/data/userProfiles.ts:337-343` for Suppliers.

**Interfaces:**
- Produces `ProfileTab.highlightIcons?: string[]`, an optional list of public SVG URLs aligned with `ProfileTab.highlights`.

- [ ] **Step 1: Extend the profile data type**

Add this property directly after `highlights?: string[]`:

```ts
  highlights?: string[];
  highlightIcons?: string[];
```

- [ ] **Step 2: Add the Shareholders mapping**

Add this property directly after the Shareholders `highlights` array:

```ts
      highlightIcons: [
        "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-27.svg",
        "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-28.svg",
        "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-29.svg",
        "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-30.svg",
        "/icons/user-profile/Key-highlights/Shareholders/Web%20Icons-31.svg",
      ],
```

- [ ] **Step 3: Add the Employees mapping**

Add this property directly after the Employees `highlights` array:

```ts
      highlightIcons: [
        "/icons/user-profile/Key-highlights/Employees/Web%20Icons-32.svg",
        "/icons/user-profile/Key-highlights/Employees/Web%20Icons-33.svg",
        "/icons/user-profile/Key-highlights/Employees/Web%20Icons-34.svg",
        "/icons/user-profile/Key-highlights/Employees/Web%20Icons-35.svg",
      ],
```

- [ ] **Step 4: Add the Customers mapping**

Add this property directly after the Customers `highlights` array:

```ts
      highlightIcons: [
        "/icons/user-profile/Key-highlights/Customers/Web%20Icons-36.svg",
        "/icons/user-profile/Key-highlights/Customers/Web%20Icons-37.svg",
        "/icons/user-profile/Key-highlights/Customers/Web%20Icons-38.svg",
        "/icons/user-profile/Key-highlights/Customers/Web%20Icons-39.svg",
        "/icons/user-profile/Key-highlights/Customers/Web%20Icons-40.svg",
      ],
```

- [ ] **Step 5: Add the Suppliers mapping**

Add this property directly after the Suppliers `highlights` array:

```ts
      highlightIcons: [
        "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-41.svg",
        "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-42.svg",
        "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-43.svg",
        "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-44.svg",
        "/icons/user-profile/Key-highlights/Suppliers/Web%20Icons-45.svg",
      ],
```

- [ ] **Step 6: Confirm the data-only change type-checks**

Run: `pnpm exec tsc --noEmit`

Expected: the command exits successfully with no TypeScript errors.

- [ ] **Step 7: Commit the data mapping**

```bash
git add src/data/userProfiles.ts
git commit -m "feat: map profile highlight icons"
```

### Task 2: Render Supplied SVGs in Key Highlights

**Files:**
- Modify: `src/components/UserProfile/HighlightsStrategySection.tsx:1-24` for the image import and prop type.
- Modify: `src/components/UserProfile/HighlightsStrategySection.tsx:95-114` for per-item rendering.

**Interfaces:**
- Consumes `highlightIcons?: string[]` from Task 1.
- Produces decorative SVG rendering through `next/image` and preserves the existing Heroicon fallback.

- [ ] **Step 1: Import Next Image**

Add this import before the existing React import:

```ts
import Image from "next/image";
```

- [ ] **Step 2: Add the optional icon prop**

Add the property to `HighlightsStrategySectionV2Props` directly after `highlights?: string[]`:

```ts
  highlights?: string[];
  highlightIcons?: string[];
```

Destructure it in the component parameters:

```ts
export default function HighlightsStrategySectionV2({
  highlights,
  highlightIcons,
  strategy,
}: HighlightsStrategySectionV2Props) {
```

- [ ] **Step 3: Render the supplied icon or fallback icon**

Inside the existing `highlights.map` callback, replace the current `<Icon className="h-8 w-8" />` with:

```tsx
                      {highlightIcons?.[index] ? (
                        <Image
                          src={highlightIcons[index]}
                          alt=""
                          width={64}
                          height={64}
                          className="h-8 w-8"
                        />
                      ) : (
                        <Icon className="h-8 w-8" />
                      )}
```

The empty alt text keeps the decorative visual out of the repeated text announcement for screen readers. The fixed dimensions preserve the current visual scale inside the existing 20x20 wrapper.

- [ ] **Step 4: Run the component type check**

Run: `pnpm exec tsc --noEmit`

Expected: the command exits successfully with no TypeScript errors.

- [ ] **Step 5: Commit the renderer change**

```bash
git add src/components/UserProfile/HighlightsStrategySection.tsx
git commit -m "feat: render profile highlight svg icons"
```

### Task 3: Pass Active Profile Icons and Verify the Feature

**Files:**
- Modify: `src/components/UserProfile/UserProfilePage.tsx:401-408` to pass the active profile's icon list.

**Interfaces:**
- Consumes `tab.highlightIcons` from `ProfileTab`.
- Produces the complete tab-specific Key Highlights experience.

- [ ] **Step 1: Pass the active profile mapping**

Update the existing `HighlightsStrategySection` usage to:

```tsx
                <HighlightsStrategySection
                  highlights={tab.highlights}
                  highlightIcons={tab.highlightIcons}
                  strategy={tab.strategy}
                />
```

- [ ] **Step 2: Verify asset and data counts**

Run:

```bash
node -e 'const fs=require("fs"); const groups={Shareholders:5,Employees:4,Customers:5,Suppliers:5}; for (const [group,count] of Object.entries(groups)) { const dir="public/icons/user-profile/Key-highlights/"+group; const files=fs.readdirSync(dir).filter((file)=>file.endsWith(".svg")); if (files.length !== count) throw new Error(group+" expected "+count+" SVGs, found "+files.length); }'
```

Expected: the command exits successfully without output.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`

Expected: ESLint completes with zero errors and zero warnings.

- [ ] **Step 4: Run the production build**

Run: `pnpm build`

Expected: the Next.js production build completes successfully with zero TypeScript errors.

- [ ] **Step 5: Commit the integration**

```bash
git add src/components/UserProfile/UserProfilePage.tsx
git commit -m "feat: assign icons to profile highlights"
```

- [ ] **Step 6: Manually verify tab behavior**

Open `/user-profile` and confirm:

- Shareholders displays five icons from `Web Icons-27.svg` through `Web Icons-31.svg` beside the five existing highlight labels.
- Employees displays four icons from `Web Icons-32.svg` through `Web Icons-35.svg` beside the four existing highlight labels.
- Customers displays five icons from `Web Icons-36.svg` through `Web Icons-40.svg` beside the five existing highlight labels.
- Suppliers displays five icons from `Web Icons-41.svg` through `Web Icons-45.svg` beside the five existing highlight labels.
- General User remains unchanged.
