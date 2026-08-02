import { Slider } from '@base-ui-components/react/slider';
import React from 'react';
import { cn } from '../utils';

export type SliderRootProps = React.ComponentPropsWithoutRef<typeof Slider.Root>;

export const SliderRoot = React.forwardRef<HTMLDivElement, SliderRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <Slider.Root
        ref={ref}
        className={cn('grid w-[140px] grid-cols-[1fr_auto] items-center gap-3', className)}
        defaultValue={[50]}
        max={100}
        step={1}
        {...props}
      >
        <Slider.Control className="relative flex h-7 touch-none select-none items-center">
          <Slider.Track className="relative h-1.5 w-full rounded-full bg-white/15 shadow-inner shadow-black/40">
            <Slider.Indicator className="absolute h-full rounded-full bg-[color:var(--keyos-app-accent)]" />
            <Slider.Thumb
              className="block size-5 rounded-full border border-[color:var(--keyos-app-accent)] bg-keyos-cream shadow-lg shadow-black/50 outline-none transition focus-visible:ring-2 focus-visible:ring-[color:var(--keyos-app-accent)]/50"
              aria-label="Volume"
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    );
  },
);

SliderRoot.displayName = 'SliderRoot';
