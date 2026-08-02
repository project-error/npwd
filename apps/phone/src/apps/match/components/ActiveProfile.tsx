import React, { useState, useRef } from 'react';
import { X, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FormattedProfile } from '@typings/match';
import Draggable from './Draggable';
import StatusDisplay from './StatusDisplay';
import Profile from './profile/Profile';
import { Tooltip } from '@ui/components/Tooltip';
import { cn } from '@utils/css';

interface IProps {
  profile: FormattedProfile;
  onSwipe: (id: number, liked: boolean) => void;
}

const DECISION_THRESHOLD_X_px = 150;

const ActiveProfile = ({ profile, onSwipe }: IProps) => {
  const [t] = useTranslation();
  const [status, setStatus] = useState(null);
  const statusRef = useRef(null);
  const idRef = useRef(null);

  statusRef.current = status;
  idRef.current = profile.id;

  function onDrag(deltaX: number): void {
    const hasDecision = status !== null;
    if (!hasDecision && deltaX > DECISION_THRESHOLD_X_px) {
      setStatus(true);
    } else if (!hasDecision && deltaX < -DECISION_THRESHOLD_X_px) {
      setStatus(false);
    } else if (deltaX > -DECISION_THRESHOLD_X_px && deltaX < DECISION_THRESHOLD_X_px) {
      setStatus(null);
    }
  }

  const handleSwipe = () => {
    onSwipe(idRef.current, statusRef.current);
    setStatus(null);
  };

  const handleLike = () => {
    onSwipe(idRef.current, true);
    setStatus(null);
  };
  const handleNope = () => {
    onSwipe(idRef.current, false);
    setStatus(null);
  };

  const isLiked = status === true;
  const notLiked = status === false;

  const statusBase = 'absolute top-10 z-20 px-[15px] py-[5px] text-[28px] font-bold';
  const likeClass = cn(
    statusBase,
    isLiked ? 'opacity-100 transition-opacity duration-[250ms]' : 'opacity-0 transition-none',
    'left-[30px] -rotate-[18deg] border-[6px] border-green-500 text-green-500',
  );
  const nopeClass = cn(
    statusBase,
    notLiked ? 'opacity-100 transition-opacity duration-[250ms]' : 'opacity-0 transition-none',
    'right-[30px] rotate-[18deg] border-[6px] border-red-500 text-red-500',
  );

  return (
    <>
      <Draggable id="active-profile" onDrag={onDrag} onDrop={handleSwipe}>
        <div className="relative m-[15px_15px_25px_15px] h-[calc(95%-90px)] w-[calc(100%-30px)] cursor-pointer overflow-hidden rounded-xl bg-keyos-panel shadow-lg">
          <StatusDisplay className={likeClass} text={t('MATCH.MESSAGES.LIKED')} visible={isLiked} />
          <StatusDisplay className={nopeClass} text={t('MATCH.MESSAGES.NOPE')} visible={notLiked} />
          <Profile profile={profile} />
        </div>
      </Draggable>
      <div className="absolute bottom-[70px] flex h-[55px] w-full items-center justify-center">
        <Tooltip title={t('MATCH.DISLIKE')} aria-label="dislike">
          <button
            type="button"
            aria-label="dislike"
            onClick={handleNope}
            className="mx-[15px] flex size-14 items-center justify-center rounded-full bg-keyos-muted text-white shadow-lg hover:opacity-90"
          >
            <X size={28} />
          </button>
        </Tooltip>
        <Tooltip title={t('MATCH.LIKE')} aria-label="like">
          <button
            type="button"
            aria-label="like"
            onClick={handleLike}
            className="mx-[15px] flex size-14 items-center justify-center rounded-full bg-[color:var(--keyos-app-accent)] text-white shadow-lg hover:opacity-90"
          >
            <Flame size={28} />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

export default ActiveProfile;
