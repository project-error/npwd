import { Button, ButtonProps, alpha } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface IStatusButtonStyleProps {
  color: StatusButtonStyleColor;
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      color: ({ color }: IStatusButtonStyleProps) => theme.palette[color].main,
      '&:hover': {
        backgroundColor: ({ color }: IStatusButtonStyleProps) =>
          alpha(theme.palette[color].light, theme.palette.action.hoverOpacity),
      },
    },
    outlined: {
      border: ({ color }: IStatusButtonStyleProps) =>
        `1px solid ${alpha(theme.palette[color].main, 0.5)}`,
      '&:hover': {
        border: ({ color }: IStatusButtonStyleProps) => `1px solid ${theme.palette[color].main}`,
      },
    },
    contained: {
      color: ({ color }: IStatusButtonStyleProps) => theme.palette[color].contrastText,
      backgroundColor: ({ color }: IStatusButtonStyleProps) => theme.palette[color].main,
      '&:hover': {
        backgroundColor: ({ color }: IStatusButtonStyleProps) => theme.palette[color].dark,
      },
    },
  }),
  { name: 'MuiButton' },
);

export const StatusButton: React.FC<
  Omit<ButtonProps, 'color'> & { color: StatusButtonStyleColor }
> = ({ color = 'info', variant, className, ...props }) => {
  const classes = useStyles({ color });
  return (
    <Button
      variant={variant}
      className={`${classes.root} ${classes[variant] || ''} ${className}`}
      {...props}
    />
  );
};
