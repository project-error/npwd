export const useThemeType = () => {
  const rootElement = document.getElementById('root')!;
  const isLightTheme = rootElement.style.getPropertyValue('--theme-type') === 'light';

  return isLightTheme ? 'light' : 'dark';
};
