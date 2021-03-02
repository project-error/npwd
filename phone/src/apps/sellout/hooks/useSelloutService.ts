import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { selloutState } from './state';
import { useListing } from './useListing';
import { useSetRecoilState } from 'recoil';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useSelloutService = () => {
  const setSellout = useSetRecoilState(selloutState.listing);
  const { addAlert } = useSnackbar();

  useNuiEvent('SELLOUT', 'setAlert', addAlert);
  useNuiEvent('SELLOUT', 'setListings', setSellout);
  return useListing();
};
