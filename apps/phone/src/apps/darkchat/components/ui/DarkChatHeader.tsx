import React, { useState } from 'react';
import { useApp } from '@os/apps/hooks/useApps';
import { ArrowLeft, Edit, Check, ShieldCheck } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { useNavigate } from 'react-router';
import { useActiveDarkchatValue } from '../../state/state';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { TextField } from '@ui/components/Input';
import { useModal } from '@apps/darkchat/hooks/useModal';
import { useTranslation } from 'react-i18next';
import { Button } from '@ui/components/Button';

const DarkChatHeader: React.FC = () => {
  const { backgroundColor } = useApp('DARKCHAT');
  const activeConversation = useActiveDarkchatValue();
  const { setOwnerModal } = useModal();
  const { leaveChannel, updateChannelLabel } = useDarkchatAPI();
  const navigate = useNavigate();
  const myPhoneNumber = useMyPhoneNumber();
  const [t] = useTranslation();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(activeConversation.label);

  const handleLeaveChannel = () => {
    leaveChannel(activeConversation.id);
  };

  const openOwnerModal = () => {
    setOwnerModal(true);
  };

  const handleUpdateLabel = () => {
    setIsEditing(false);
    if (label === activeConversation.label) return setLabel(activeConversation.label);
    if (!label.trim()) return setLabel(activeConversation.label);

    updateChannelLabel({
      channelId: activeConversation.id,
      label,
    });
  };

  const isOwner = myPhoneNumber === activeConversation.owner;

  return (
    <header
      className="flex h-[60px] items-center justify-between rounded-none"
      style={{ backgroundColor: backgroundColor || 'var(--keyos-app-surface)' }}
    >
      <div className="flex flex-row items-center gap-1">
        <NPWDButton size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </NPWDButton>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <TextField
              inputProps={{ style: { fontSize: 23 } }}
              value={label}
              onChange={(e) => setLabel(e.currentTarget.value)}
            />
          ) : (
            <p className="text-[26px] text-keyos-cream">{label}</p>
          )}
          {isOwner && (
            <div>
              {isEditing ? (
                <NPWDButton size="icon" variant="ghost" onClick={handleUpdateLabel}>
                  <Check size={20} />
                </NPWDButton>
              ) : (
                <NPWDButton size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit size={20} />
                </NPWDButton>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="pr-2">
        {isOwner ? (
          <NPWDButton size="icon" variant="ghost" onClick={openOwnerModal}>
            <ShieldCheck size={22} />
          </NPWDButton>
        ) : (
          <Button variant="text" onClick={handleLeaveChannel}>
            {t('DARKCHAT.LEAVE')}
          </Button>
        )}
      </div>
    </header>
  );
};

export default DarkChatHeader;
