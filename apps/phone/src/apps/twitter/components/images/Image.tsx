import React from 'react';
import { X } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { PictureReveal } from '@ui/components/PictureReveal';
import { PictureResponsive } from '@ui/components/PictureResponsive';

export const Image = ({ link, handleClick }) => {
  return (
    <div className="relative inline-block">
      {handleClick && (
        <NPWDButton
          size="icon"
          variant="ghost"
          onClick={handleClick}
          className="absolute right-[5px] top-[2px] z-[1] bg-black/70 hover:bg-black/70"
        >
          <X size={16} className="text-white" />
        </NPWDButton>
      )}
      <PictureReveal>
        <PictureResponsive alt="small avatar" src={link} />
      </PictureReveal>
    </div>
  );
};

export default Image;
