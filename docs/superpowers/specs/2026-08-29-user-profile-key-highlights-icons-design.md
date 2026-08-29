# User Profile Key Highlights Icons

## Goal

Use the supplied profile-specific SVG assets in the User Profile page's Key Highlights section. Keep General User unchanged.

## Scope

The existing `highlights` arrays define the display order. Each profile's `highlightIcons` array will use the matching SVGs in that same order:

- Shareholders: `Web Icons-27.svg` through `Web Icons-31.svg`
- Employees: `Web Icons-32.svg` through `Web Icons-35.svg`
- Customers: `Web Icons-36.svg` through `Web Icons-40.svg`
- Suppliers: `Web Icons-41.svg` through `Web Icons-45.svg`

All assets are located in `public/icons/user-profile/Key-highlights/<Profile>/`.

## Architecture

Add an optional `highlightIcons?: string[]` field to `ProfileTab` in `src/data/userProfiles.ts`. Store public asset URLs beside each profile's highlight copy. General User will not receive this field.

Pass the selected profile's icon data into `HighlightsStrategySection`. For each highlight, render the corresponding SVG with `next/image`. The current Heroicons remain the fallback when an icon path is unavailable, so the section remains resilient and General User's current behavior is preserved.

The existing card layout, hover states, reveal animation, labels, and profile tab navigation remain unchanged.

## Data Flow

1. `PROFILE_TABS` provides `highlights` and optional `highlightIcons` for the active profile.
2. `UserProfilePage` passes both values to `HighlightsStrategySection`.
3. The section pairs each highlight with the icon at the same array index.
4. A missing icon entry uses the existing positional Heroicon fallback.

## Error Handling

Icon arrays are optional and may be shorter than the highlights array. The component will fall back per item rather than failing the entire section. No new runtime or network data source is introduced.

## Verification

- Run `pnpm lint`.
- Run `pnpm build`.
- Confirm the four supplied profile folders map to the correct highlight counts and that General User is not changed.
