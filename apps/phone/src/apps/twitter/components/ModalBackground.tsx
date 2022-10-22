import { memo } from 'react';
import { useModal } from '../hooks/useModal';
import Backdrop from '@ui/components/Backdrop';

const ModalBackground = () => {
  const { modalVisible } = useModal();

  return modalVisible && <Backdrop />;
};

export default memo(ModalBackground);
