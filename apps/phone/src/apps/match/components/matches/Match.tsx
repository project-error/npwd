import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { UserRound, MessageCircle } from 'lucide-react';
import { ListItem } from '@npwd/keyos';
import { NPWDButton } from '@npwd/keyos';

import { FormattedMatch } from '@typings/match';
import Profile from '../profile/Profile';

interface IProps {
  match: FormattedMatch;
}

export const Match = ({ match }: IProps) => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [showProfile, setShowProfile] = useState(false);

  const handleMessage = () => {
    navigate(`/messages/new?phoneNumber=${match.phoneNumber}`);
  };

  const handleProfile = () => {
    setShowProfile((show) => !show);
  };

  const secondaryText = t('MATCH.MESSAGES.PROFILE_MATCHED_AT', {
    matchedAt: match.matchedAtFormatted,
  });

  return (
    <>
      <ListItem
        button
        primaryText={match.name}
        secondaryText={secondaryText}
        endElement={
          <div className="flex items-center gap-1">
            <NPWDButton size="icon" variant="ghost" onClick={handleProfile}>
              <UserRound size={20} />
            </NPWDButton>
            <NPWDButton size="icon" variant="ghost" onClick={handleMessage}>
              <MessageCircle size={20} />
            </NPWDButton>
          </div>
        }
      />
      {showProfile && (
        <div className="relative mt-[15px] h-[90%]">
          <Profile profile={match} />
        </div>
      )}
    </>
  );
};

export default Match;
