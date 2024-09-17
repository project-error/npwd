import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface NavigationContextType {
  isDisabled: boolean;
  setIsDisabled: (isDisabled: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: PropsWithChildren) => {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <NavigationContext.Provider value={{ isDisabled, setIsDisabled }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigationContext = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useDisableNavigation must be used within a NavigationProvider');
  }

  return context;
};

export const useDisableNavigation = (isDisabled?: boolean) => {
  const { isDisabled: _isDisabled, setIsDisabled } = useNavigationContext();

  useEffect(() => {
    if (isDisabled === undefined) return;
    setIsDisabled(isDisabled);
  }, [isDisabled, setIsDisabled]);

  return _isDisabled;
};
