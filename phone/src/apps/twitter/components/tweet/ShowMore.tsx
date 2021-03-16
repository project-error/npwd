import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import Nui from '../../../../os/nui-events/utils/Nui';
import ReportButton from '../buttons/ReportButton';

export const ShowMore = ({ id, isReported, isMine }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t } = useTranslation();
  const { config } = usePhone();

  if (!config) return null;

  const handleClick = (event: React.MouseEvent) => {
    const element = event.currentTarget;
    setAnchorEl(element);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTweet = () => {
    Nui.send('phone:deleteTweet', id);
    handleClose();
  };

  const allowedToDelete = config.twitter.allowDeleteTweets && isMine;
  const allowedToReport = config.twitter.allowReportTweets && !isMine;

  // if the user cannot perform any actions in show more then don't
  // allow them to interact with it
  let _handleClick = allowedToDelete || allowedToReport ? handleClick : () => null;

  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={_handleClick}>
        <MoreIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: -30,
          horizontal: 'left',
        }}
      >
        {allowedToDelete && (
          <MenuItem onClick={handleDeleteTweet}>{t('APPS_TWITTER_DELETE')}</MenuItem>
        )}
        {allowedToReport && (
          <ReportButton handleClose={handleClose} isReported={isReported} tweetId={id} />
        )}
      </Menu>
    </>
  );
};

export default ShowMore;
