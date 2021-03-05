import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { selloutState } from './state';
import { useListing } from './useListing';
import { useSetRecoilState } from 'recoil';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useSelloutService = () => {
  const setSellout = useSetRecoilState(selloutState.listing);
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('SELLOUT', 'setAlert', handleAddAlert);
  useNuiEvent('SELLOUT', 'setListings', setSellout);
  return useListing();
};
