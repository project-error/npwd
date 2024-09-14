export const isRunningInGame = () => {
  return typeof RegisterCommand !== 'undefined';
};
