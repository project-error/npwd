import React from 'react';
import { ChannelItemProps } from '@typings/darkchat';
import { ListItem } from '@npwd/keyos';
import { useNavigate } from 'react-router';
import { useSetActiveDarkchatState } from '../../state/state';
import { MessageSquare } from 'lucide-react';

export const ChannelItem: React.FC<ChannelItemProps> = (item) => {
  const navigate = useNavigate();
  const setActiveConversation = useSetActiveDarkchatState();

  const handleGoToConversation = () => {
    setActiveConversation(item);
    navigate(`/darkchat/conversation/${item.id}`);
  };

  return (
    <ListItem
      button
      onClick={handleGoToConversation}
      startElement={
        <div className="flex size-10 items-center justify-center rounded-full bg-[color:var(--keyos-app-accent)]/20 text-[color:var(--keyos-app-accent)]">
          <MessageSquare size={18} />
        </div>
      }
      primaryText={item.label ?? item.identifier}
    />
  );
};
