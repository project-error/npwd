import { useEffect } from 'react';
import { isSettingsSchemaValid } from '../utils/schema';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useInvalidSettingsHandler = () => {
  // The best time for us to handle really is on mount, we can indepdently check for schema validity,
  // without having to worry about whether settings atom has been initialized yet.
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isSettingsSchemaValid()) {
      addAlert({
        message: t('SETTINGS.MESSAGES.INVALID_SETTINGS'),
        type: 'error',
      });
    }
    // We only want to run on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
