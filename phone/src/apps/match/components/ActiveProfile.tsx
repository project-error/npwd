import React, { useState, useRef } from 'react';
import { Card, Fab, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Clear';
import FireIcon from '@mui/icons-material/Whatshot';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';

import { FormattedProfile } from '@typings/match';
import Draggable from './Draggable';
import StatusDisplay from './StatusDisplay';
import Profile from './profile/Profile';
import { Tooltip } from '@ui/components/Tooltip';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    margin: '15px 15px 25px 15px',
    height: 'calc(100% - 90px)',
    width: 'calc(100% - 30px)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  media: {
    height: '60%',
  },
  content: {
    height: '40%',
  },
  status: {
    position: 'absolute',
    zIndex: 20,
    padding: '5px 15px',
    top: 40,
    fontSize: '28px',
    fontWeight: 'bold',
  },
  statusVisible: {
    transition: 'opacity 0.25s ease-in-out',
  },
  // when a user swipes on a profile we need to hide the transition
  // otherwise the status will be transitioning out when the next
  // profile shows up
  statusNull: {
    transition: 'opacity 0s',
  },
  like: {
    color: 'green',
    border: '6px solid green',
    left: 30,
    transform: 'rotate(-18deg)',
  },
  nope: {
    color: 'red',
    border: '6px solid red',
    right: 30,
    transform: 'rotate(18deg)',
  },
  buttons: {
    position: 'absolute',
    bottom: '10px',
    width: '100%',
    height: '55px',
  },
  button: {
    margin: '0px 15px',
  },
});

interface IProps {
  profile: FormattedProfile;
  onSwipe: (id: number, liked: boolean) => void;
}

// this represents how far from the original mouse
// click a user has to drag the profile in order for
// it to be registered as a like or dislike
const DECISION_THRESHOLD_X_px = 150;

const ActiveProfile = ({ profile, onSwipe }: IProps) => {
  const c = useStyles();
  const [t] = useTranslation();
  const [status, setStatus] = useState(null);
  const statusRef = useRef(null);
  const idRef = useRef(null);

  // we are reading mutated state from the Draggable element so we
  // keep track of it using a ref. Without this ref it will appear
  // from React's point of view that the state is not updating
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

  // handles when user uses mouse to "swipe", or
  // more specifically drag the card to one side or the other
  const handleSwipe = () => {
    onSwipe(idRef.current, statusRef.current);
    setStatus(null);
  };

  // these handlers are explicit and used for when the
  // user clicks on buttons
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

  const likeClass = `${c.status} ${isLiked ? c.statusVisible : c.statusNull} ${c.like}`;
  const nopeClass = `${c.status} ${notLiked ? c.statusVisible : c.statusNull} ${c.nope}`;

  return (
    <>
      <Draggable id="active-profile" onDrag={onDrag} onDrop={handleSwipe}>
        <Card raised className={c.root}>
          <StatusDisplay className={likeClass} text={t('MATCH.MESSAGES.LIKED')} visible={isLiked} />
          <StatusDisplay className={nopeClass} text={t('MATCH.MESSAGES.NOPE')} visible={notLiked} />
          <Profile profile={profile} />
        </Card>
      </Draggable>
      <Box className={c.buttons} display="flex" justifyContent="center">
        <Tooltip title={t('MATCH.DISLIKE')} aria-label="dislike">
          <Fab
            size="large"
            color="secondary"
            aria-label="dislike"
            onClick={handleNope}
            className={c.button}
          >
            <CancelIcon />
          </Fab>
        </Tooltip>
        <Tooltip title={t('MATCH.LIKE')} aria-label="like">
          <Fab
            size="large"
            color="primary"
            aria-label="like"
            onClick={handleLike}
            className={c.button}
          >
            <FireIcon />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
};

export default ActiveProfile;
