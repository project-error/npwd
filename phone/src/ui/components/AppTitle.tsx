import React, { HTMLAttributes } from 'react';
import { Typography, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { IApp } from '@os/apps/config/apps';
import { OverridableStringUnion } from '@mui/types';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';
import { Variant } from '@mui/material/styles/createTypography';

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
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
}

// Taso: Maybe we should pass an icon (maybe fa?) as a prop as well at somepoint
// but need to think about the best way to do that for standardization sake.
export const AppTitle: React.FC<AppTitleProps> = ({
  app: { backgroundColor, color, nameLocale },
  variant = 'h5',
  ...props
}) => {
  const classes = useStyle({ color, backgroundColor });
  const [t] = useTranslation();
  return (
    <Box px={2} pt={2} className={classes.root} {...props}>
      <Typography className={classes.text} paragraph variant={variant}>
        {t(nameLocale)}
      </Typography>
    </Box>
  );
};
