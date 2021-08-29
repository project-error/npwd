import React, { HTMLAttributes } from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';
import { IApp } from '../../os/apps/config/apps';

interface IUseStyle {
  root: any;
  text: any;
}

const useStyle = makeStyles(
  (theme): IUseStyle => ({
    root: ({ backgroundColor }) => ({
      width: '100%',
      textAlign: 'left',
      backgroundColor: backgroundColor || theme.palette.background.default,
    }),
    text: ({ color }) => ({
      color: color || theme.palette.text.primary,
    }),
  }),
);

interface AppTitleProps extends HTMLAttributes<HTMLDivElement> {
  app: IApp;
  variant?: Variant;
}

// Taso: Maybe we should pass an icon (maybe fa?) as a prop as well at somepoint
// but need to think about the best way to do that for standardization sake.
export const AppTitle: React.FC<AppTitleProps> = ({
  app: { backgroundColor, color, nameLocale },
  variant = 'h5',
  ...props
}) => {
  const classes = useStyle({ color, backgroundColor });
  const { t } = useTranslation();
  return (
    <Box px={2} pt={2} className={classes.root} {...props}>
      <Typography className={classes.text} paragraph variant={variant}>
        {t(nameLocale)}
      </Typography>
    </Box>
  );
};
