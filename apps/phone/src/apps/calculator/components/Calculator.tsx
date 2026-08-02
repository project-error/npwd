import React, { useMemo } from 'react';
import { useCalculator } from '../hooks/useCalculator';
import { setClipboard } from '@os/phone/hooks/useClipboard';
import { Copy } from 'lucide-react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { CalculatorButton } from './CalculatorButton';
import { cn } from '@utils/css';

const getFontSize = (length: number) => {
  const currentSize = 5 - length * 0.2;
  return currentSize <= 1.5 ? '1.5rem' : `${currentSize}rem`;
};

export const Calculator: React.FC = () => {
  const {
    result,
    equals,
    clear,
    clearAll,
    divider,
    multiplier,
    substractor,
    adder,
    dot,
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
  } = useCalculator();

  const { addAlert } = useSnackbar();
  const [t] = useTranslation();

  const resultStr = useMemo(
    () =>
      result().toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
      }),
    [result],
  );

  const handleCopyClipboard = () => {
    setClipboard(resultStr);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }),
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'relative min-h-28 flex-1 overflow-hidden text-ellipsis bg-keyos-night p-4 text-right text-keyos-fg',
        )}
        style={{ fontSize: resultStr.length < 9 ? '2rem' : getFontSize(resultStr.length) }}
      >
        <button
          type="button"
          aria-label="Copy result"
          className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow hover:brightness-110"
          onClick={handleCopyClipboard}
        >
          <Copy size={16} />
        </button>
        {resultStr}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <CalculatorButton buttonOpts={clear} />
        <CalculatorButton buttonOpts={clearAll} />
        <CalculatorButton buttonOpts={divider} />
        <CalculatorButton buttonOpts={multiplier} />
        <CalculatorButton buttonOpts={seven} />
        <CalculatorButton buttonOpts={eight} />
        <CalculatorButton buttonOpts={nine} />
        <CalculatorButton buttonOpts={substractor} />
        <CalculatorButton buttonOpts={four} />
        <CalculatorButton buttonOpts={five} />
        <CalculatorButton buttonOpts={six} />
        <CalculatorButton buttonOpts={adder} />
        <CalculatorButton buttonOpts={one} />
        <CalculatorButton buttonOpts={two} />
        <CalculatorButton buttonOpts={three} />
        <CalculatorButton buttonOpts={equals} />
        <CalculatorButton buttonOpts={dot} />
        <CalculatorButton buttonOpts={zero} colSpan={3} />
      </div>
    </div>
  );
};
