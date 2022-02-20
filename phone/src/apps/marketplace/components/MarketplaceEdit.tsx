import { EUseHookValues, useHookValues } from '@common/hooks/useHookValues';
import { Button, Stack, Typography } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { MarketplaceEvents, MarketplaceResp } from '@typings/marketplace';
import fetchNui from '@utils/fetchNui';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useListing } from '../hooks/state';
import MarketplaceForm, { IListingFormValues } from './MarketplaceForm';

const MarketPlaceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { push } = useHistory();
  const { path } = useApp('MARKETPLACE');
  const listing = useListing(Number(id));

  const { reset } = useHookValues(EUseHookValues.MARKETPLACE);

  const handleSubmit = async (data: IListingFormValues) => {
    try {
      const result = await fetchNui<ServerPromiseResp<MarketplaceResp>>(
        MarketplaceEvents.EDIT_LISTING,
        data,
      );

      if (result.status !== 'ok') {
        addAlert({ message: t(result.errorMsg), type: 'error' });
        return;
      }

      reset();
      push(path);
      addAlert({
        message: t('MARKETPLACE.FEEDBACK.EDIT_LISTING_SUCCESS'),
        type: 'success',
      });
    } catch (err) {
      addAlert({ message: t('MARKETPLACE.FEEDBACK.EDIT_LISTING_FAILED'), type: 'error' });
      return;
    }
  };

  const handleDeleteListing = async () => {
    try {
      const res = await fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
        id,
      });

      if (res.status !== 'ok') {
        return addAlert({
          message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED'),
          type: 'error',
        });
      }

      push(path);
      addAlert({
        message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_SUCCESS'),
        type: 'success',
      });
    } catch (err) {
      addAlert({
        message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED'),
        type: 'error',
      });
    }
  };

  return (
    <Stack p={3.5} spacing={2}>
      <Stack direction="row" justifyContent="space-between" width="100%">
        <Typography variant="h6">{t('MARKETPLACE.EDIT_LISTING')}</Typography>
        <Button onClick={() => push(`${path}/${id}`)}>Back</Button>
      </Stack>

      <MarketplaceForm onSubmit={handleSubmit} initialValues={{ ...listing }} />
      <Button color="error" variant="outlined" onClick={handleDeleteListing}>
        {t('GENERIC.DELETE')}
      </Button>
    </Stack>
  );
};

export default MarketPlaceEdit;
