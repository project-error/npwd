import { ENTERED, ENTERING, EXITED, EXITING, UNMOUNTED } from './Transition';

export type TransitionStatus =
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING
  | typeof EXITED
  | typeof UNMOUNTED;
