import * as Slider from '@radix-ui/react-slider';
import React from 'react';

export const SliderRoot: React.FC<Slider.SliderProps> = ({ ...props }) => {
  return (
    <Slider.Root
      className="relative flex h-5 w-[200px] touch-none select-none items-center"
      defaultValue={[50]}
      max={100}
      step={1}
      {...props}
    >
      <Slider.Track className="relative h-[3px] grow rounded-full dark:bg-neutral-700">
        <Slider.Range className="absolute h-full rounded-full dark:bg-neutral-50" />
      </Slider.Track>
      <Slider.Thumb
        className="hover:bg-violet3 block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-black focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none"
        aria-label="Volume"
      />
    </Slider.Root>
  );
};
