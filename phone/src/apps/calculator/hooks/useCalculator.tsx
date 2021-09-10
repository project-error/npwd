import { useReducer } from 'react';

const initialState = {
  value: 0,
  op: '',
  num1: 0,
  num2: '',
  num3: '',
};

const Reducer = (state, action) => {
  switch (action.type) {
    case '2':
      if (!state.num1) {
        return { ...state, num1: state.num2, op: action.payload, num2: '' };
      }
      if (!state.num2) {
        return { ...state, op: action.payload };
      }
      if (state.num1 && state.op) {
        return {
          ...state,
          value: state.op(state.value, state.num2),
          op: action.payload,
        };
      }
      return {
        ...state,
        value: state.op(state.num1, state.num2),
        num2: '',
        op: action.payload,
        num1: state.op(state.num1, state.num2),
      };

    case '1':
      if (state.num2 === '' && action.payload === '.') {
        return { ...state, num2: '0' + action.payload };
      }
      if (state.num2 === '') {
        return { ...state, num2: action.payload };
      }
      if (action.payload === '.' && state.num2.includes('.')) {
        return state;
      } else {
        return { ...state, num2: state.num2 + action.payload };
      }

    case '3':
      if (state.op && state.num2) {
        return {
          ...state,
          value: state.op(state.num1, state.num2),
          num2: '',
          num1: state.op(state.num1, state.num2),
          num3: state.num2,
        };
      }
      if (state.op && state.value) {
        return { ...state, value: state.op(state.value, state.num3) };
      }
      return state;

    case 'c':
      if (state.num2.length === 2 && state.num2.includes('0.')) {
        return { ...state, num2: '' };
      }
      if (state.num2.length > 1) {
        return { ...state, num2: state.num2.slice(0, -1) };
      }
      return { ...state, num2: '' };

    case 'ac':
      return {
        value: 0,
        op: '',
        num1: 0,
        num2: '',
        num3: '',
      };

    default:
      return state;
  }
};

export const useCalculator = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getPayload = (label, type) => {
    if (type !== '2') {
      return `${label}`;
    }
    switch (label) {
      case '/':
        return (a, b) => Number(a) / Number(b);
      case '*':
        return (a, b) => Number(a) * Number(b);
      case '+':
        return (a, b) => Number(a) + Number(b);
      case '-':
        return (a, b) => Number(a) - Number(b);
      default:
        break;
    }
  };

  const buttonProps = (label, type) => ({
    label,
    onClick: () =>
      dispatch({
        type,
        payload: getPayload(label, type),
      }),
  });

  const number = (n) => buttonProps(n, '1');
  const operator = (sym) => buttonProps(sym, '2');
  const clear = buttonProps('C', 'c');
  const clearAll = buttonProps('AC', 'ac');
  const equals = buttonProps('=', '3');
  const zero = number(0);
  const dot = number('.');
  const divider = operator('/');
  const multiplier = operator('*');
  const adder = operator('+');
  const substractor = operator('-');
  const one = number(1);
  const two = number(2);
  const three = number(3);
  const four = number(4);
  const five = number(5);
  const six = number(6);
  const seven = number(7);
  const eight = number(8);
  const nine = number(9);
  const result = (): number => (!state.num2 ? state.value : state.num2);

  return {
    result,
    equals,
    clear,
    clearAll,
    divider,
    multiplier,
    substractor,
    adder,
    dot,
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
  };
};
