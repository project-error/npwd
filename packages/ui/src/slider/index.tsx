import * as Slider from '@radix-ui/react-slider';
import React from 'react';

export const SliderRoot: React.FC<Slider.SliderProps> = ({ ...props }) => {
  return (
    <Slider.Root
      className="relative flex h-5 w-[120px] touch-none select-none items-center"
      defaultValue={[50]}
      max={100}
      step={1}
      {...props}
    >
      <Slider.Track className="relative h-[3px] grow rounded-full bg-neutral-400 dark:bg-neutral-700">
        <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-neutral-50" />
      </Slider.Track>
      <Slider.Thumb
        className="block h-5 w-5 rounded-[10px] bg-neutral-900 dark:bg-white focus:outline-none"
        aria-label="Volume"
      />
    </Slider.Root>
  );
};
