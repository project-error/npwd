import { useKeys } from '@/hooks/useKeys';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Image as ImageIcon } from 'react-feather';
import { useDisableNavigation } from '@/contexts/NavigationContext';
import { FooterLine } from '../FooterLine';
import { useLoadImage } from '@/hooks/useLoadImage';

type Direction = 'left' | 'right';
const sliderVariants: Variants = {
  initial: (direction: Direction) => ({
    x: direction === 'right' ? '100%' : '-100%',
  }),
  animate: {
    x: 0,
    scale: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === 'right' ? '-100%' : '100%',
    scale: 0.8,
    transition: {
      duration: 0.5,
      delay: 0.05,
    },
  }),
};

interface ImageViewerProps {
  initialIndex?: number;
  images: string[];
  onClose: () => void;
}

export const ImageViewer = ({ images, onClose, initialIndex = 0 }: ImageViewerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<Direction>('right');

  useDisableNavigation(true);
  useKeys({
    Escape: onClose,
    Backspace: onClose,
  });

  useLoadImage(images[currentImageIndex + 1]);

  const nextImage = () => {
    if (currentImageIndex === images.length - 1) {
      return;
    }

    setCurrentImageIndex((prev) => prev + 1);
    setDirection('right');
  };

  const prevImage = () => {
    if (currentImageIndex === 0) {
      return;
    }

    setCurrentImageIndex((prev) => prev - 1);
    setDirection('left');
  };

  const currentImage = images[currentImageIndex];

  useKeys({
    ArrowRight: nextImage,
    ArrowLeft: prevImage,
    Escape: onClose,
  });

  return (
    <motion.div
      className="absolute inset-0 bg-black bg-opacity-50 flex flex-col w-full h-full z-20"
      initial={{
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <div className="flex-1 bg-secondary p-4 bg-opacity-50">
        <Button size="icon" variant="ghost">
          <ImageIcon />
        </Button>
      </div>

      <div className="flex-4 flex h-full relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImage}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            transition={{
              duration: 0.5,
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            variants={sliderVariants}
            className="flex-4 flex h-full absolute top-0 left-0 right-0 bottom-0"
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                prevImage();
              } else if (info.offset.x < -100) {
                nextImage();
              }
            }}
          >
            {images.length > 1 && (
              <span className="absolute left-2 top-2 h-12 w-12 bg-secondary text-lg flex justify-center items-center rounded-lg">
                {currentImageIndex + 1}
              </span>
            )}

            <img
              draggable={false}
              key={currentImage}
              src={currentImage}
              alt="Image"
              className="object-cover flex-4 h-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <span
        className="bg-primary p-5 bg-opacity-50 flex justify-center mt-auto flex-0 pb-3"
        onClick={onClose}
      >
        <FooterLine />
      </span>
    </motion.div>
  );
};
