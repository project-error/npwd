let isFocused = false;
const exps = global.exports;

RegisterCommand(
  'mock-command',
  () => {
    console.log('calling mock command');
  },
  false,
);
