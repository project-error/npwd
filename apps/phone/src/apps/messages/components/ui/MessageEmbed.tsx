import React from 'react';
import { Contact } from '@typings/contact';
import { Location } from '@typings/messages';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import fetchNui from '../../../../utils/fetchNui';
import { MessageEvents } from '@typings/messages';
import { NoteItem } from '@typings/notes';
import qs from 'qs';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Button, Tooltip } from '@npwd/keyos';
import { FileText, MapPinned, MoreVertical, Pause, Play, UserPlus } from 'lucide-react';

dayjs.extend(duration);

interface MessageEmbedProps {
  type: string;
  embed: any;
  isMine: boolean;
  message: string;
  openMenu: () => void;
}

type MessageEmbedType = {
  [key: string]: JSX.Element;
};

const MessageEmbed: React.FC<MessageEmbedProps> = ({ type, embed, isMine, message, openMenu }) => {
  const embedType: MessageEmbedType = {
    contact: <ContactEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
    location: <LocationEmbed embed={embed} isMine={isMine} message={message} openMenu={openMenu} />,
    note: <NoteEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
    audio: <AudioEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
  };

  return <>{embedType[type]}</>;
};

const ContactEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: Contact;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getContactByNumber } = useContactActions();

  const showAddButton = !isMine && !getContactByNumber(embed?.number);

  const handleAddContact = () => {
    const referal = encodeURIComponent(pathname);
    navigate(`/contacts/-1?addNumber=${embed.number}&name=${embed.display}&referal=${referal}`);
  };

  return (
    <div className="flex min-w-[220px] items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {embed?.avatar ? (
          <img src={embed.avatar} className="size-10 rounded-full object-cover" alt={embed?.display} />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-black/20 text-xs font-bold">
            {(embed?.display || embed?.number || '?').slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{embed?.display}</p>
          <p className="truncate text-xs opacity-70">{embed?.number}</p>
        </div>
      </div>
      {showAddButton && (
        <Button onClick={handleAddContact} size="icon" variant="glass">
          <UserPlus size={16} />
        </Button>
      )}
      {isMine && (
        <button className="rounded-full p-1 opacity-70 hover:bg-white/10 hover:opacity-100" onClick={openMenu}>
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
};

const NoteEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: NoteItem;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleViewNote = () => {
    const queryStr = qs.stringify({
      title: embed?.title,
      content: embed?.content,
    });

    const referal = encodeURIComponent(pathname);
    navigate(`/notes/?${queryStr}&referal=${referal}`);
  };

  return (
    <div className="flex min-w-[220px] items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{embed?.title}</p>
        <p className="truncate text-xs opacity-70">{embed?.content.substring(0, 24) + ' ...'}</p>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip title={t('MESSAGES.NOTE_TOOLTIP')}>
          <button className="rounded-full p-1.5 hover:bg-white/10" onClick={handleViewNote}>
            <FileText size={18} />
          </button>
        </Tooltip>
        {isMine && (
          <button className="rounded-full p-1.5 hover:bg-white/10" onClick={openMenu}>
            <MoreVertical size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const LocationEmbed = ({
  isMine,
  embed,
  message,
  openMenu,
}: {
  embed: Location;
  isMine: boolean;
  message: string;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();

  const handleSetWaypoint = () => {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: embed.coords,
    });
  };

  return (
    <div className="flex min-w-[220px] items-center justify-between gap-3">
      <p className="text-sm font-semibold">{message ?? t('MESSAGES.LOCATION_MESSAGE')}</p>
      <div className="flex items-center gap-1">
        <Tooltip title={t('MESSAGES.LOCATION_TOOLTIP')}>
          <button className="rounded-full p-1.5 hover:bg-white/10" onClick={handleSetWaypoint}>
            <MapPinned size={18} />
          </button>
        </Tooltip>
        {isMine && (
          <button className="rounded-full p-1.5 hover:bg-white/10" onClick={openMenu}>
            <MoreVertical size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const AudioEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: { url: string };
  openMenu: () => void;
}) => {
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(embed.url);

  const calculateProgress =
    isNaN(duration) || duration == Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-black/15 p-2" onClick={playing ? pause : play}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-current transition-all"
            style={{ width: `${calculateProgress || 8}%` }}
          />
        </div>
        {isMine && (
          <button className="rounded-full p-1.5 hover:bg-white/10" onClick={openMenu}>
            <MoreVertical size={18} />
          </button>
        )}
      </div>
      <p className="pl-1 text-xs opacity-70">{dayjs.duration(currentTime * 1000).format('mm:ss')}</p>
    </div>
  );
};

export default MessageEmbed;
