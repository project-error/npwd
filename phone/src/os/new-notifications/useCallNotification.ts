import { useSnackbar } from 'notistack';
import { useRecoilCallback } from 'recoil';

export const useCallNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
      onEnd: () => console.log('Ended'),
      onAccept: () => console.log('Accepted'),
    });
  });

  const removeNotification = () => {};

  return {
    enqueueCallNotification,
  };
};
