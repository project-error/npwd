import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Variant } from "@material-ui/core/styles/createTypography";

interface IProps {
  app: any;
  className?: string;
  variant?: Variant;
}

interface IUseStyle {
  root: any;
  text: any;
}

const useStyle = makeStyles(
  (theme): IUseStyle => ({
    root: ({ backgroundColor }) => ({
      width: "100%",
      textAlign: "center",
      backgroundColor: backgroundColor || theme.palette.background.default,
    }),
    text: ({ color }) => ({
      color: color || theme.palette.text.primary,
    }),
  })
);

export const AppTitle = ({
  app: { backgroundColor, color, nameLocale },
  variant = "h4",
  ...props
}: IProps) => {
  const classes = useStyle({ color, backgroundColor });
  const { t } = useTranslation();
  return (
    <Box px={2} pt={4} className={classes.root} {...props}>
      <Typography className={classes.text} paragraph variant={variant}>
        {t(nameLocale)}
      </Typography>
    </Box>
  );
};
