import { useCall } from '@os/call/hooks/useCall';
import { useSnackbar } from 'notistack';
import { useRecoilCallback } from 'recoil';

export const useCallNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { acceptCall, endCall, rejectCall } = useCall();

  const enqueueCallNotification = useRecoilCallback(({ set, snapshot }) => (dto: any) => {
    enqueueSnackbar('', {
      variant: 'npwdCallNotification',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      persist: true,
      title: 'Call',
      transmitter: dto.transmitter,
      key: 'npwd:callNotification',
      onEnd: () => endCall(),
      onReject: () => rejectCall(),
      onAccept: () => acceptCall(),
    });
  });

  const removeNotification = () => {
    closeSnackbar('npwd:callNotification');
  };

  return {
    enqueueCallNotification,
    removeNotification,
  };
};
