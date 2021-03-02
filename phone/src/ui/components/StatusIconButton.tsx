import {
  fade,
  IconButton,
  IconButtonProps,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

interface IStatusButtonStyleProps {
  color: StatusButtonStyleColor;
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      color: ({ color }: IStatusButtonStyleProps) =>
        theme.palette[color].contrastText,
      backgroundColor: ({ color }: IStatusButtonStyleProps) =>
        theme.palette[color].main,
      '&:hover': {
        backgroundColor: ({ color }: IStatusButtonStyleProps) =>
          theme.palette[color].light,
      },
    },
    outlined: {
      border: ({ color }: IStatusButtonStyleProps) =>
        `1px solid ${fade(theme.palette[color].main, 0.5)}`,
      '&:hover': {
        border: ({ color }: IStatusButtonStyleProps) =>
          `1px solid ${theme.palette[color].main}`,
      },
      '&$disabled': {
        border: `1px solid ${theme.palette.action.disabled}`,
      },
    },
    contained: {
      color: ({ color }: IStatusButtonStyleProps) =>
        theme.palette[color].contrastText,
      backgroundColor: ({ color }: IStatusButtonStyleProps) =>
        theme.palette[color].main,
      '&:hover': {
        backgroundColor: ({ color }: IStatusButtonStyleProps) =>
          theme.palette[color].dark,
      },
    },
  }),
  { name: 'MuiIconButton' }
);

export const StatusIconButton = ({
  color = 'info',
  size,
  className,
  ...props
}: Omit<IconButtonProps, 'color'> & { color: StatusButtonStyleColor }) => {
  const classes = useStyles({ color });
  return (
    <IconButton
      className={`${classes.root} ${className}`}
      size={size}
      {...props}
    />
  );
};
