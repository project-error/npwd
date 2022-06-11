declare global {
  namespace NodeJS {
    interface Global {
      isPhoneOpen: boolean;
      isPhoneDisabled: boolean;
      isPlayerLoaded: boolean;
      clientPhoneNumber: string | null;
    }
  }
}
export {};
