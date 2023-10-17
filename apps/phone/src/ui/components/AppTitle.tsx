import React, { HTMLAttributes } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IApp } from '@os/apps/config/apps';
import { OverridableStringUnion } from '@mui/types';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';
import { Variant } from '@mui/material/styles/createTypography';

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
  const [t] = useTranslation();
  return (
    // TODO: Support color and backgroundColor
    <div className="px-4 py-2 pt-4 bg-neutral-100 dark:bg-neutral-900" {...props}>
      <h3 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">
        {t(nameLocale)}
      </h3>
    </div>
  );
};
