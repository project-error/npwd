import { formatMoney, getCurrencySign, getSignLocation } from '@common/utils/currency';
import { InputAdornment, TextFieldProps } from '@mui/material';
import { ChangeEventHandler } from 'react';
import { TextField } from '../Input';

const PriceField = ({ onChange, ...props }: TextFieldProps) => {
  const currencySignLocation = getSignLocation();
  const isLocationBefore = currencySignLocation === 'before';
  const currencySign = getCurrencySign();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = formatMoney(Number(value), false);

    if (!value) {
      onChange?.(event);
      return;
    }

    const formattedEvent = {
      ...event,
      target: { ...event.target, value: formattedValue },
    };

    onChange?.(formattedEvent);
  };

  return (
    <TextField
      {...props}
      ref={null}
      onChange={handleChange}
      InputProps={{
        startAdornment: !isLocationBefore ? null : (
          <InputAdornment position="start">{currencySign}</InputAdornment>
        ),
        endAdornment: isLocationBefore ? null : (
          <InputAdornment position="end">{currencySign}</InputAdornment>
        ),
      }}
    />
  );
};

export default PriceField;
