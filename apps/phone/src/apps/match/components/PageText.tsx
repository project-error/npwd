import React from 'react';

interface IProps {
  text: string;
}

function PageText({ text }: IProps) {
  return (
    <div className="flex h-full w-full justify-center px-[15px] pb-[15px] pt-[140px] text-center text-[color:var(--keyos-app-accent)]">
      <h5 className="text-xl font-medium text-keyos-cream">{text}</h5>
    </div>
  );
}

export default PageText;
