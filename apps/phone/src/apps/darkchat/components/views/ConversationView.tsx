import React, { useEffect, useState } from 'react';
import { useActiveDarkchatValue, useDarkchatMessagesValue } from '../../state/state';
import { useLocation, useNavigate } from 'react-router';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import ChannelMessageBubble from '../ui/ChannelMessageBubble';
import ChannelImageBubble from '../ui/ChannelImageBubble';
import ChannelInput from '../ui/ChannelInput';
import { UploadMediaModal } from '../modals/UploadMedia';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useModal } from '../../hooks/useModal';
import Backdrop from '@ui/components/Backdrop';
import { OwnerModal } from '@apps/darkchat/components/modals/OwnerModal';

export const ConversationView: React.FC = () => {
  const activeConversation = useActiveDarkchatValue();
  const { fetchMessages, fetchMembers } = useDarkchatAPI();
  const messages = useDarkchatMessagesValue();
  const navigate = useNavigate();
  const query = useQueryParams();
  const { pathname, search } = useLocation();
  const { setModalMedia, modalVisible, ownerModal, setOwnerModal } = useModal();

  useEffect(() => {
    if (!query?.image) return;

    setModalMedia(query.image);

    navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
  }, [query?.image, navigate, pathname, search, setModalMedia]);

  useEffect(() => {
    fetchMessages(activeConversation.id);
    fetchMembers(activeConversation.id);
  }, [activeConversation]);

  if (!activeConversation && !messages) return <LoadingSpinner />;

  return (
    <div className="flex flex-1 flex-grow flex-col">
      <UploadMediaModal />
      <OwnerModal open={ownerModal} closeModal={() => setOwnerModal(false)} />
      {modalVisible || (ownerModal && <Backdrop />)}
      <div className="flex h-[605px] w-full flex-col overflow-auto">
        {messages.map((message) =>
          message.isImage ? (
            <ChannelImageBubble key={message.id} {...message} />
          ) : (
            <ChannelMessageBubble key={message.id} {...message} />
          ),
        )}
      </div>
      <div>
        <ChannelInput />
      </div>
    </div>
  );
};
