import React, { FocusEventHandler, useRef, useState } from 'react';
import { ChevronLeft, RotateCw } from 'lucide-react';
import { InputBase } from '@ui/components/Input';
import { cn } from '@utils/css';

interface BrowserControlsProps {
  setBrowser: (url: string) => void;
  browserUrl: string;
  reloadPage: () => void;
  browserHasHistory: boolean;
  goBack: () => void;
}

export const BrowserURLBar: React.FC<BrowserControlsProps> = ({
  goBack,
  reloadPage,
  browserHasHistory,
  browserUrl,
  setBrowser,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState('');
  const [isFocused, setFocus] = useState(false);

  const handleFocus: FocusEventHandler = () => {
    setInputState(browserUrl);
    setFocus(true);
  };

  const handleFocusOut: FocusEventHandler = () => {
    setFocus(false);
    setInputState(browserUrl);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputState(e.target.value);
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e as any).code !== 'Enter') return;
    setBrowser(inputState);
    e.currentTarget.blur();
  };

  const styledUrl = browserUrl.replace(/(^\w+:|^)\/\//, '');

  const transformedUrl = isFocused ? inputState : styledUrl;

  return (
    <div className="flex px-2 py-2">
      <button
        type="button"
        aria-label="Reload page"
        className="rounded-full p-1.5 text-keyos-fg transition-colors hover:bg-white/10"
        onClick={() => reloadPage()}
      >
        <RotateCw size={18} />
      </button>
      {browserHasHistory && (
        <button
          type="button"
          aria-label="Go back"
          className="rounded-full p-1.5 text-keyos-fg transition-colors hover:bg-white/10"
          onClick={() => goBack()}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <InputBase
        className={cn(
          'ml-1.5 rounded-[18px] border border-solid border-[#787878] px-2.5 pr-2.5 transition-colors duration-100',
          isFocused ? 'text-keyos-fg' : 'text-keyos-muted',
        )}
        ref={inputRef}
        fullWidth
        onChange={handleChange}
        onKeyDown={onEnter}
        value={transformedUrl}
        onFocus={handleFocus}
        spellCheck={false}
        onBlur={handleFocusOut}
      />
    </div>
  );
};
