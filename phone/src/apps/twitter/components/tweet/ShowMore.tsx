import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { useNuiRequest } from 'fivem-nui-react-lib';
import ReportButton from '../buttons/ReportButton';
import { TwitterEvents } from '../../../../../../typings/twitter';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTwitterActions } from '../../hooks/useTwitterActions';

export const ShowMore = ({ id, isReported, isMine }) => {
  const Nui = useNuiRequest();
  const [t] = useTranslation();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const { deleteTweet } = useTwitterActions();

  if (!ResourceConfig) return null;

  const handleClick = (event: React.MouseEvent) => {
    const element = event.currentTarget;
    setAnchorEl(element);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTweet = () => {
    fetchNui<ServerPromiseResp<void>>(TwitterEvents.DELETE_TWEET, { tweetId: id }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_TWITTER_DELETE_TWEET_FAILED'),
          type: 'error',
        });
      }

      deleteTweet(id);

      handleClose();
    });
    //Nui.send(TwitterEvents.DELETE_TWEET, id);
  };

  const allowedToDelete = ResourceConfig.twitter.allowDeleteTweets && isMine;
  const allowedToReport = ResourceConfig.twitter.allowReportTweets && !isMine;

  // if the user cannot perform any actions in show more then don't
  // allow them to interact with it
  let _handleClick = allowedToDelete || allowedToReport ? handleClick : () => null;

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={_handleClick}
        style={{ marginRight: 15 }}
      >
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
