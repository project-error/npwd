import React, { useState } from 'react';
import { TextField } from '@ui/components/Input';
import { Send, Share } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { Tooltip } from '@ui/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';
import { useActiveDarkchatValue } from '../../state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useModal } from '../../hooks/useModal';

const ChannelInput: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [t] = useTranslation();
  const { sendMessage } = useDarkchatAPI();
  const { id: channelId } = useActiveDarkchatValue();
  const phoneNumber = useMyPhoneNumber();
  const { setModalVisible } = useModal();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage({
      channelId,
      message,
      phoneNumber,
      type: 'text',
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
      setMessage('');
    }
  };

  return (
    <div className="flex items-center rounded-md border border-white/10 bg-keyos-panel">
      <div className="flex-grow pb-1 pl-3 pt-1">
        <TextField
          style={{ paddingTop: 7, paddingBottom: 7 }}
          inputProps={{
            style: {
              fontSize: 18,
              textIndent: 5,
            },
          }}
          placeholder={t('DARKCHAT.MESSAGE_PLACEHOLDER')}
          fullWidth
          value={message}
          maxRows={4}
          multiline
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex items-center">
        <Tooltip title={t('DARKCHAT.MEDIA_UPLOAD')}>
          <NPWDButton size="icon" variant="ghost" onClick={() => setModalVisible(true)}>
            <Share size={20} className="text-[color:var(--keyos-app-accent)]" />
          </NPWDButton>
        </Tooltip>
        <Tooltip title={t('GENERIC.SEND')}>
          <NPWDButton size="icon" variant="ghost" onClick={handleSendMessage}>
            <Send size={20} className="text-[color:var(--keyos-app-accent)]" />
          </NPWDButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChannelInput;
