import React, { HTMLAttributes } from 'react';
import { Button, Grid } from '@mui/material';
import { GridProps } from '@mui/material';

interface ButtonOptions {
  onClick: () => void;
  label: string;
}

interface CalculatorButtonProps extends HTMLAttributes<HTMLButtonElement> {
  GridProps?: GridProps;
  buttonOpts: ButtonOptions;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  className,
  buttonOpts,
  GridProps,
}) => (
  <Grid key={buttonOpts.label} item xs={3} {...GridProps}>
    <Button
      fullWidth
      className={className}
      onClick={buttonOpts.onClick}
      sx={{
        color: 'white',
      }}
    >
      {buttonOpts.label}
    </Button>
  </Grid>
);
