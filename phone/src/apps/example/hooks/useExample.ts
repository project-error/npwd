import { useRecoilValue } from 'recoil';
import { exampleState } from './state';

export const useExample = () => {
  const example = useRecoilValue(exampleState.example);
  return example;
};
