# KeyOS Component Guide

`@npwd/keyos` is the shared OS UI kit for the FiveM phone. Build new phone UI here first, then consume it from `apps/phone`.

## Principles

- Use Base UI for interactive primitives such as dialogs, tooltips, switches, sliders, menus, and future selects/popovers.
- Use Tailwind CSS v4 classes for styling.
- Use `cva` for variants and sizes.
- Use `cn()` for class merging.
- Keep components composable. Prefer small primitives plus a convenient composed wrapper.
- Keep app-specific colors scoped. Do not replace OS tokens globally.
- Avoid MUI, `@mui/styles`, Emotion, and app-local one-off styling for new OS work.

## OS Tokens

The shared OS colors live in `src/styles.css` and are used through Tailwind classes:

- `bg-keyos-night`
- `bg-keyos-panel`
- `bg-keyos-panel-strong`
- `text-keyos-cream`
- `text-keyos-muted`
- `text-keyos-amber`
- `shadow-keyos-panel`
- `shadow-keyos-glow`

Use these for most OS surfaces.

## App-Scoped Colors

Use `AppColorScope` when an app needs its own accent colors for only some parts.

```tsx
import { AppColorScope } from '@npwd/keyos';

export const ContactsThemeProvider = ({ children }: { children: React.ReactNode }) => (
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
    {children}
  </AppColorScope>
);
```

Then opt in only where needed:

```tsx
<Button className="bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)]">
  Save
</Button>
```

Do not use `AppColorScope` to recolor the whole OS shell.

## Creating A New Component

1. Create a folder under `packages/ui/src`, for example `src/action-sheet/index.tsx`.
2. Use Base UI when the component is interactive.
3. Use `cva` when the component has variants.
4. Export the component from `src/index.ts`.
5. Build with `pnpm --filter @npwd/keyos build`.
6. Consume it from the phone app through `@npwd/keyos`.

Example:

```tsx
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils';

const panelVariants = cva(
  'rounded-3xl border border-white/10 bg-keyos-panel-strong text-keyos-cream shadow-keyos-panel backdrop-blur-xl',
  {
    variants: {
      padding: {
        sm: 'p-3',
        md: 'p-5',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  },
);

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, padding, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ padding, className }))} {...props} />
  ),
);

Panel.displayName = 'Panel';
```

Export it:

```ts
export * from './panel/index';
```

## Base UI Pattern

Expose both primitive pieces and a composed wrapper when useful.

```tsx
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';

export const DialogRoot = BaseDialog.Root;
export const DialogClose = BaseDialog.Close;

export const Dialog = ({ children, open, onOpenChange }) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    {/* shared backdrop and panel */}
    {children}
  </DialogRoot>
);
```

This lets apps use the simple wrapper most of the time, while still allowing custom composition.

## Phone App Usage

Use shared components directly:

```tsx
import { Button, Input, MessageBubble } from '@npwd/keyos';

<Input placeholder="Search" />
<Button>Call</Button>
<MessageBubble from="player">Where are you?</MessageBubble>
```

For screens, keep OS colors as the default:

```tsx
<div className="bg-keyos-night text-keyos-cream">
  <div className="rounded-2xl bg-keyos-panel shadow-keyos-panel" />
</div>
```

Use app colors only for app-specific intent:

```tsx
<button className="bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)]">
  Message
</button>
```

## Migration Checklist

When replacing MUI:

- Remove `@mui/material`, `@mui/icons-material`, `@mui/styles`, and MUI theme imports from the file.
- Replace MUI layout components with semantic HTML and Tailwind.
- Replace MUI buttons/inputs/dialogs/tooltips with `@npwd/keyos`.
- Replace `makeStyles` with Tailwind classes or `cva`.
- Use `lucide-react` for icons unless a custom OS icon exists.
- Run the KeyOS and phone builds.
