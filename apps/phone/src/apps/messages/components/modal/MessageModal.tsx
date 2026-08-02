import { useEffect, useState } from 'react';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState } from '../../hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useCall } from '@os/call/hooks/useCall';
import { useMessageActions } from '../../hooks/useMessageActions';
import GroupDetailsModal from './GroupDetailsModal';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { usePhone } from '@os/phone/hooks';
import { ArrowLeft, Phone, UserPlus, UsersRound } from 'lucide-react';
import MessageInput from '../form/MessageInput';
import AudioContextMenu from './AudioContextMenu';
import MessageContextMenu from './MessageContextMenu';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { Button, Tooltip } from '@npwd/keyos';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

// abandon all hope ye who enter here
export const MessageModal = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { groupId } = useParams<{ groupId: string }>();
  const { activeMessageConversation, setActiveMessageConversation } = useMessages();
  const { fetchMessages } = useMessageAPI();
  const { getLabelOrContact, getConversationParticipant } = useMessageActions();
  const { initializeCall } = useCall();

  const { getContactByNumber } = useContactActions();
  const [messages, setMessages] = useMessagesState();

  const [isLoaded, setLoaded] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [audioContextMenuOpen, setAudioContextMenuOpen] = useState(false);

  const query = useQueryParams();
  const referalImage = query?.image || null;
  const referalNote = query?.note || null;

  const { ResourceConfig } = usePhone();

  const myPhoneNumber = useMyPhoneNumber();

  useEffect(() => {
    if (groupId) {
      fetchMessages(groupId, 0);
    }
  }, [groupId, fetchMessages]);

  useEffect(() => {
    let timeout;
    if (activeMessageConversation && messages) {
      timeout = setTimeout(() => {
        setLoaded(true);
      }, MINIMUM_LOAD_TIME);
      return;
    }
    setLoaded(false);
  }, [activeMessageConversation, messages]);

  const closeModal = () => {
    setMessages(null);
    navigate('/messages');
  };

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(parseInt(groupId, 10));
  }, [groupId, setActiveMessageConversation]);

  useEffect(() => {
    if (isLoaded) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isLoaded]);

  // We need to wait for the active conversation to be set.
  if (!activeMessageConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  let header = getLabelOrContact(activeMessageConversation);
  // don't allow too many characters, it takes too much room
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? 'max-w-[230px] text-lg' : 'max-w-[250px] text-xl';

  const handleAddContact = (number: string) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return navigate(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return navigate(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  // This only gets used for 1 on 1 conversations
  let conversationList = activeMessageConversation.conversationList.split('+');
  conversationList = conversationList.filter((targetNumber) => targetNumber !== myPhoneNumber);
  // Add optionals here out of abundancy of caution for phone number being null
  // Participant is not participant ots the local phone number
  let targetNumber: string =
    conversationList.length > 0 ? conversationList[0] : activeMessageConversation.participant;

  const doesContactExist = getConversationParticipant(activeMessageConversation.conversationList);
  return (
      <div className="flex h-full w-full animate-in slide-in-from-right-4 flex-col bg-keyos-night text-keyos-cream">
        <div className="flex items-center justify-between border-b border-white/10 bg-keyos-night/90 px-2 py-2 backdrop-blur-xl">
          <button
            onClick={closeModal}
            className="rounded-full p-2 text-keyos-muted transition hover:bg-white/10 hover:text-keyos-cream"
          >
            <ArrowLeft size={26} />
          </button>
          <h2 className={`${headerClass} truncate px-2 font-bold tracking-tight text-keyos-cream`}>
            {header}
          </h2>
          {!activeMessageConversation.isGroupChat && (
            <Tooltip
              title={`${t('GENERIC.CALL')} ${targetNumber}`}
            >
              <button
                onClick={() => initializeCall(targetNumber)}
                className="rounded-full p-3 text-keyos-muted transition hover:bg-white/10 hover:text-[color:var(--keyos-app-accent)]"
              >
                <Phone size={18} />
              </button>
            </Tooltip>
          )}
          {activeMessageConversation.isGroupChat ? (
            <Button onClick={openGroupModal} size="icon" variant="ghost">
              <UsersRound size={20} />
            </Button>
          ) : !activeMessageConversation.isGroupChat && !doesContactExist ? (
            <Button onClick={() => handleAddContact(targetNumber)} size="icon" variant="ghost">
              <UserPlus size={20} />
            </Button>
          ) : !activeMessageConversation.isGroupChat && doesContactExist ? null : null}
        </div>
        <div className="min-h-0 flex-1">
          {isLoaded && activeMessageConversation && ResourceConfig ? (
            <Conversation
              isVoiceEnabled={ResourceConfig.voiceMessage.enabled}
              messages={messages}
              activeMessageGroup={activeMessageConversation}
            />
          ) : (
            <MessageSkeletonList />
          )}
        </div>
        <div>
          <div>
            {audioContextMenuOpen ? (
              <AudioContextMenu onClose={() => setAudioContextMenuOpen(false)} />
            ) : (
              <MessageInput
                messageGroupName={activeMessageConversation.participant}
                messageConversation={activeMessageConversation}
                onAddImageClick={() => setContextMenuOpen(true)}
                onVoiceClick={() => setAudioContextMenuOpen(true)}
                voiceEnabled={ResourceConfig.voiceMessage.enabled}
              />
            )}
          </div>
          <MessageContextMenu
            messageGroup={activeMessageConversation}
            isOpen={contextMenuOpen}
            onClose={() => setContextMenuOpen(false)}
            image={referalImage}
            note={referalNote}
          />
        </div>

        <GroupDetailsModal
          open={isGroupModalOpen}
          onClose={closeGroupModal}
          conversationList={activeMessageConversation.conversationList}
          addContact={handleAddContact}
        />
      </div>
  );
};
