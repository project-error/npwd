# KeyOS Migration Context

This repo is in the middle of replacing Material UI with a GTA V-inspired phone OS built around `@npwd/keyos` in `packages/ui`.

## Current Direction

- `packages/ui` is the shared OS UI package.
- The visual language should feel like a GTA V in-game phone: dark glass panels, amber highlights, compact controls, heavy blur/shadow, and crisp app-specific accent colors.
- Base UI is the primitive layer for accessible interactive components.
- Tailwind CSS v4, `tw-animate-css`, `tailwind-merge`, `clsx`, and `class-variance-authority` are the styling/composition stack.
- New UI should avoid Material UI, `@mui/styles`, MUI theme providers, and Radix unless a file has not been migrated yet.

## Shared UI Added So Far

`@npwd/keyos` now exports:

- `AppColorScope`
- `Button`
- `Dialog`, `DialogRoot`, `DialogPortal`, `DialogBackdrop`, `DialogPanel`, `DialogPopup`, `DialogClose`, `DialogTitle`, `DialogDescription`
- `Input`
- `List`, `ListItem`
- `MessageBubble`
- `PhoneOSShell`
- `SliderRoot`
- `SwitchRoot`, `SwitchThumb`
- `Tooltip`
- `cn`

Legacy exports like `NPWDButton` still exist as compatibility shims while apps migrate.

## Scoped App Colors

Apps should not replace the OS theme globally. Use `AppColorScope` to provide app-only color variables:

```tsx
import { AppColorScope } from '@npwd/keyos';

<AppColorScope
  colors={{
    accent: '#3b82f6',
    accentForeground: '#ffffff',
    danger: '#ef4444',
    dangerForeground: '#ffffff',
    muted: '#93a4bd',
    surface: 'rgb(14 23 39 / 0.72)',
  }}
>
  <ContactsApp />
</AppColorScope>
```

Only components that intentionally use `var(--keyos-app-*)` should pick up app colors. Most OS surfaces should keep `keyos-*` classes.

## Contacts Status

The Contacts app has been migrated away from MUI imports. It now uses:

- `AppColorScope` via `ContactsThemeProvider`
- KeyOS `Button`, `Input`, `List`, `ListItem`
- Tailwind classes for layout and surfaces
- Scoped app vars for selected accents and actions

## Verification Commands

Use these after UI work:

```bash
pnpm --filter @npwd/keyos build
pnpm --filter @npwd/nui build
```

The phone build currently emits known warnings about Browserslist data, unresolved Geist font URLs at build time, large chunks, and federation plugin timing.

## Remaining Migration Areas

MUI still exists across other phone apps and some shared wrappers. Good next targets:

- `apps/phone/src/ui/components/Input.tsx`
- `AppIcon`, `DialogForm`, `WindowSnackbar`, `Notification`, `AppContent`
- OS notifications and call UI
- App icon files under `os/apps/icons`
- App-specific screens in Messages, Dialer, Camera, Twitter, Match, Notes, Marketplace, and Darkchat
