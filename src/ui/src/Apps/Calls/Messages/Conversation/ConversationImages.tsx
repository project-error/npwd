import { ImageViewer } from '@/components/Gallery/ImageViewer';
import { clsx } from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ConversationImageProps {
  images: string[];
  isReceiver: boolean;
}
export const ConversationImages = ({ images, isReceiver }: ConversationImageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

  return (
    <>
      <AnimatePresence>
        {selectedImageIndex !== -1 && (
          <ImageViewer
            images={images}
            initialIndex={selectedImageIndex}
            onClose={() => {
              setSelectedImageIndex(-1);
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1 mt-2 w-full flex-1">
        {images.length > 1 && (
          <span
            className={clsx(
              'font-bold text-xs text-secondary',
              isReceiver ? 'text-left' : 'text-right',
            )}
          >
            {images.length} images
          </span>
        )}

        <div className="flex overflow-auto justify-start max-w-80 isolate border rounded-2xl">
          {images.map((src, index) => (
            <motion.div
              key={src}
              className={clsx(
                'h-40 rounded-xl flex-none object-cover cursor-pointer shadow-2xl drop-shadow-2xl',
              )}
              style={{
                zIndex: -index,
                marginLeft: index !== 0 ? `-45px` : 0,
              }}
              onClick={() => setSelectedImageIndex(index)}
              animate={{ opacity: 1 }}
            >
              <img
                draggable={false}
                src={src}
                alt="Image"
                className={clsx(
                  'h-40 rounded-xl flex-none object-cover cursor-pointer shadow-2xl drop-shadow-2xl',
                )}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};
