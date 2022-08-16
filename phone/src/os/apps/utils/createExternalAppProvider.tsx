import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider, CircularProgress } from '@mui/material';
import { deepMergeObjects } from '@shared/deepMergeObjects';
import { usePhoneTheme } from '@os/phone/hooks/usePhoneTheme';
import { IApp } from '../config/apps';
import styled from '@emotion/styled';

const colorShade = (col: any, amt: number) => {
  col = col.replace(/^#/, '');
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};

const Container = styled.div<{ background: string; color: string }>`
  height: 100%;
  width: 100%;

  color: ${({ color }) => color ?? '#fff'};
  background: ${({ background }) => background ?? '#222'};

  display: flex;
  align-items: center;
  justify-content: center;

  background-size: 400% 400%;
  animation: gradient 6s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 2rem;
`;

const IconWrapper = styled.div`
  svg {
    width: 3.5rem;
    height: 3.5rem;
  }

  animation: 3s linear 0.25s infinite alternate breath;

  @keyframes breath {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(1.5);
    }
  }
`;

const SplashScreen = (props: IApp) => {
  const { backgroundColor, icon } = props;

  const light = colorShade(backgroundColor, 30);
  const dark = colorShade(backgroundColor, -30);
  const background = `linear-gradient(45deg,${light}, ${dark}, ${light}, ${dark}, ${dark})`;

  return (
    <Container {...props} background={background}>
      <IconWrapper>{icon}</IconWrapper>

      <ProgressContainer>
        <CircularProgress color="inherit" />
      </ProgressContainer>
    </Container>
  );
};

export function createExternalAppProvider(config: IApp) {
  return ({ children }: { children: React.ReactNode }) => {
    const phoneTheme = usePhoneTheme();

    const mergedTheme = useMemo(() => {
      return createTheme(deepMergeObjects(phoneTheme, config?.theme));
    }, [phoneTheme]);

    return (
      <StyledEngineProvider injectFirst>
        <React.Suspense fallback={<SplashScreen {...config} />}>
          <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>
        </React.Suspense>
      </StyledEngineProvider>
    );
  };
}
