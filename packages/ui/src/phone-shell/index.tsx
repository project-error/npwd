import { cva, VariantProps } from 'class-variance-authority';

import React from 'react';

import { cn } from '../utils';

import { PhoneFrameChassis, PhoneFrameColor } from './phone-frame-chassis';

const shellVariants = cva(
  'pointer-events-auto fixed h-[1000px] w-[500px] origin-bottom-right scale-[var(--keyos-zoom)] transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none',
  {
    variants: {
      visible: {
        true: 'translate-y-0 opacity-100',
        false: 'translate-y-[115%] opacity-0',
      },
      tone: {
        vinewood: 'text-keyos-fg',
        fib: 'text-sky-100',
        night: 'text-white',
      },
    },
    defaultVariants: {
      visible: true,
      tone: 'vinewood',
    },
  },
);

export interface PhoneOSShellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof shellVariants> {
  bottom?: number | string;
  children: React.ReactNode;
  frameColor?: PhoneFrameColor;
  frameImage?: string;
  frameVariant?: 'image' | 'samsung';
  screenClassName?: string;
  screenStyle?: React.CSSProperties;
  zoom?: number;
}

export const PhoneOSShell = React.forwardRef<HTMLDivElement, PhoneOSShellProps>(
  (
    {
      bottom = 0,
      children,
      className,
      frameColor = 'titanium',
      frameImage,
      frameVariant = 'samsung',
      screenClassName,
      screenStyle,
      style,
      tone,
      visible,
      zoom = 1,
      ...props
    },
    ref,
  ) => {
    const useSamsungFrame = frameVariant === 'samsung';

    const screenClasses = cn(
      'bg-keyos-night text-keyos-fg shadow-[inset_0_0_0_1px_var(--keyos-screen-ring)]',
      'before:pointer-events-none before:absolute before:inset-0 before:z-[-1] before:bg-[image:var(--keyos-shell-gradient)]',
      'after:pointer-events-none after:absolute after:inset-0 after:z-[-1] after:bg-[image:var(--keyos-shell-sheen)]',
      screenClassName,
    );

    return (
      <div className="pointer-events-none fixed inset-0 overflow-x-visible overflow-y-hidden">
        <div
          ref={ref}
          className={cn(shellVariants({ visible, tone }), className)}
          style={
            {
              bottom,
              right: 'var(--keyos-shell-inset-right)',
              '--keyos-zoom': zoom,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {useSamsungFrame ? (
            <PhoneFrameChassis
              color={frameColor}
              screenClassName={screenClasses}
              screenStyle={screenStyle}
            >
              <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            </PhoneFrameChassis>
          ) : (
            <>
              {frameImage && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] bg-contain bg-center bg-no-repeat drop-shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                  style={{ backgroundImage: `url(${frameImage})` }}
                />
              )}

              <div
                id="phone"
                className={cn(
                  'absolute bottom-[100px] left-[50px] right-[50px] top-[100px] z-[2] isolate flex flex-col overflow-hidden rounded-[24px]',
                  screenClasses,
                )}
                style={screenStyle}
              >
                {!useSamsungFrame && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-[72px] top-3 z-50 h-[5px] rounded-full bg-[color:var(--keyos-notch)]"
                  />
                )}

                <div className="flex min-h-0 flex-1 flex-col">{children}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

PhoneOSShell.displayName = 'PhoneOSShell';

export type { PhoneFrameColor } from './phone-frame-chassis';
