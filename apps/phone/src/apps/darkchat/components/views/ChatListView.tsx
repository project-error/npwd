import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useChannelsValue } from '../../state/state';
import { ChannelItem } from '../ui/ChannelItem';
import { List } from '@ui/components/List';
import { NewChannelModal } from '../ui/NewChannelModal';
import Backdrop from '@ui/components/Backdrop';

const ChatList: React.FC = () => {
  const channels = useChannelsValue();
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal((curVal) => !curVal);
  };

  return (
    <div>
      <NewChannelModal open={modal} closeModal={toggleModal} />
      {modal && <Backdrop />}
      <List>
        {channels.map((channel) => (
          <ChannelItem key={channel.id} {...channel} />
        ))}
      </List>
      <div className="absolute bottom-5 right-5">
        <button
          type="button"
          onClick={toggleModal}
          className="flex size-14 items-center justify-center rounded-full bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-lg hover:opacity-90"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
