import React, { useMemo } from 'react';

import { AppColorScope, AppColorTokens, LoadingSpinner } from '@npwd/keyos';
import { useTranslation } from 'react-i18next';

import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import { IApp } from '../config/apps';
import { ExternalAppBoundary } from './externalAppBoundary';

const colorShade = (col: string, amt: number) => {
  col = col.replace(/^#/, '');
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g)!;
  [r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

const generateBackground = (bg: string) => {
  const light = colorShade(bg, 30);
  const dark = colorShade(bg, -30);
  return `linear-gradient(45deg,${light}, ${dark}, ${light}, ${dark}, ${dark})`;
};

const SplashScreen = ({ backgroundColor, color, icon }: IApp) => {
  const background = generateBackground(backgroundColor);

  return (
    <div
      className="keyos-splash flex h-full w-full items-center justify-center bg-[length:400%_400%] animate-[gradient_6s_ease_infinite]"
      style={{ background, color }}
    >
      <div className="animate-[breath_3s_linear_0.25s_infinite_alternate] [&_svg]:size-14">{icon}</div>
      <div className="absolute bottom-0 left-0 p-8">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export function createExternalAppProvider(config: IApp) {
  return ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    const appColors = usePhoneTheme(config);
    const background = generateBackground(config.backgroundColor ?? '#222');

    const colors = useMemo<AppColorTokens>(() => {
      if (config.theme && typeof config.theme === 'object' && 'accent' in config.theme) {
        return { ...appColors, ...config.theme };
      }
      return appColors;
    }, [appColors]);

    return (
      <ExternalAppBoundary background={background} color={config.color} t={t}>
        <React.Suspense fallback={<SplashScreen {...config} />}>
          <AppColorScope colors={colors}>{children}</AppColorScope>
        </React.Suspense>
      </ExternalAppBoundary>
    );
  };
}
