import { Button, Stack, Typography } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import fetchNui from '@utils/fetchNui';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import MarketplaceForm, { IListingFormValues } from './MarketplaceForm';

import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { MarketplaceEvents, MarketplaceResp } from '@typings/marketplace';
import { EUseHookValues, useHookValues } from '@common/hooks/useHookValues';

const MarketPlaceCreate = () => {
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const { push } = useHistory();
  const { path } = useApp('MARKETPLACE');

  const { reset } = useHookValues(EUseHookValues.MARKETPLACE);

  const onSubmit = async (data: IListingFormValues) => {
    const priceStr = data.price.toString();
    const value = priceStr.replace(/\D/g, '');

    try {
      const result = await fetchNui<ServerPromiseResp<MarketplaceResp>>(
        MarketplaceEvents.ADD_LISTING,
        { ...data, price: Number(value) },
      );

      if (result.status !== 'ok') {
        addAlert({ message: t(result.errorMsg), type: 'error' });
        return;
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_SUCCESS'),
        type: 'success',
      });
      reset();
      push(path);
    } catch (err) {
      addAlert({ message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_FAILURE'), type: 'error' });
      return;
    }
  };

  return (
    <Stack p={3.5} spacing={2}>
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Typography variant="h6">{t('MARKETPLACE.NEW_LISTING')}</Typography>
        <Button onClick={() => push(path)}>Back</Button>
      </Stack>

      <MarketplaceForm onSubmit={onSubmit} />
    </Stack>
  );
};

export default MarketPlaceCreate;
