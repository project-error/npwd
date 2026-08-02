import { useSetAtom } from 'jotai';
import { toggleKeys } from '@ui/components';
import { twitterState } from '../../hooks/state';
import { NPWDButton } from '@npwd/keyos';
import { Reply } from 'lucide-react';

export const ReplyButton = ({ profile_name }) => {
  const setModalVisible = useSetAtom(twitterState.showCreateTweetModal);
  const setMessage = useSetAtom(twitterState.modalMessage);

  const handleClick = () => {
    setMessage(`@${profile_name} `);
    setModalVisible(true);
  };

  return (
    <NPWDButton
      size="sm"
      variant="ghost"
      onClick={handleClick}
      onMouseUp={() => {
        toggleKeys(false);
      }}
    >
      <Reply size={20} className='text-sky-400' />
    </NPWDButton>
  );
};

export default ReplyButton;
