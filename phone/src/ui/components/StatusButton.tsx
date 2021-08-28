import { Button, ButtonProps, alpha, makeStyles } from '@material-ui/core';
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

export const StatusButton = ({
  color = 'info',
  variant,
  className,
  ...props
}: Omit<ButtonProps, 'color'> & { color: StatusButtonStyleColor }) => {
  const classes = useStyles({ color });
  return (
    <Button
      variant={variant}
      className={`${classes.root} ${classes[variant] || ''} ${className}`}
      {...props}
    />
  );
};
