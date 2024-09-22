import { AnimatePresence, motion } from 'framer-motion';
import { FooterLine } from './FooterLine';
import { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useKeys } from '@/hooks/useKeys';
import { useDisableNavigation } from '@/contexts/NavigationContext';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Drawer = ({ children, onClose, open, noPadding = false }: DrawerProps) => {
  useDisableNavigation(open);

  useKeys({
    Escape: onClose,
  });

  const handleBackdropClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onClose();
  };

  const element = document.getElementById('drawer-root');
  if (!element) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute w-full h-full bg-black top-0 left-0 z-10 flex flex-col flex-1 bg-opacity-50 dark:bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          <motion.div
            className="flex flex-col absolute bottom-0 right-0 h-full w-full bg-primary shadow-2xl drop-shadow-2xl z-20 rounded-tr-xl rounded-tl-xl overflow-hidden"
            initial={{
              height: 0,
            }}
            animate={{
              height: 'auto',
            }}
            exit={{
              height: 0,
            }}
            transition={{
              duration: 0.25,
              bounce: 0.25,
            }}
          >
            <div className="p-4 w-full flex justify-center" onClick={onClose}>
              <FooterLine />
            </div>

            {children}

            {!noPadding && <div className="h-6" />}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.getElementById('drawer-root')!,
  );
};
