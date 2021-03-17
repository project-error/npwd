import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useSetRecoilState } from 'recoil';
import { matchState } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useContactsService = () => {
  const setProfiles = useSetRecoilState(matchState.profiles);
  // const { addAlert } = useSnackbar();
  // const { t } = useTranslation();

  // const handleAddAlert = ({ message, type }: IAlert) => {
  //   addAlert({
  //     message: t(`APPS_${message}`),
  //     type,
  //   });
  // };

  useNuiEvent('MATCH', 'setProfiles', setProfiles);
  return {};
};
