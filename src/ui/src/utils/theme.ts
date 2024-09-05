interface Theme {
  textColor: {
    primary: string;
    secondary: string;
  };
  backgroundColor: {
    primary: string;
    secondary: string;
  };
}

export const setTheme = (theme: Theme) => {
  const rootElement = document.getElementById('root')!;
  rootElement.style.setProperty('--bg-primary', theme.backgroundColor.primary);
  rootElement.style.setProperty('--bg-secondary', theme.backgroundColor.secondary);
  rootElement.style.setProperty('--text-primary', theme.textColor.primary);
  rootElement.style.setProperty('--text-secondary', theme.textColor.secondary);
};
