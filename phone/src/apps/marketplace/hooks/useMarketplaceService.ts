import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { selloutState } from './state';
import { useListing } from './useListing';
import { useSetRecoilState } from 'recoil';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { MarketplaceEvents } from '../../../../../typings/marketplace';

export const useMarketplaceService = () => {
  const setSellout = useSetRecoilState(selloutState.listing);
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('SELLOUT', MarketplaceEvents.SEND_ALERT, handleAddAlert);
  useNuiEvent('SELLOUT', MarketplaceEvents.SEND_LISTING, setSellout);
  return useListing();
};
