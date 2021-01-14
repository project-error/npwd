import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import Nui from '../../../../os/nui-events/utils/Nui';
import ReportButton from '../buttons/ReportButton';

/**
 *  Ok this is some bullshit. Due to either scaling issues or the NUI
 *  overlay being different than the display resolution just letting
 *  material-ui determine what the anchor positioning of the popover
 *  is not reliable and has some error that appears to scale vertically.
 *
 *  This vertical offset raises the popover positioning implementing the
 *  transformOrigin prop that material-ui's Popover element provides.
 *
 *  These coefficients are NOT based on any known offsets or calc()
 *  functions. They are empiricallly determined. The actual scaling issue
 *  does NOT appear to be linear, but over the comparatively low height
 *  of the phone compared to the window it produces results that are within
 *  acceptable tolerances from the player's perspective.
 * @param top - the computed distance from the top of the window to the top
 * of the anchor element
 */
function calculateVerticalOffset(top: number): number {
  return top * 0.2 - 38;
}

export const ShowMore = ({ id, isReported, isMine }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const { t } = useTranslation();
  const { config } = usePhone();

  if (!config) return null;

  const handleClick = (event: React.MouseEvent) => {
    const element = event.currentTarget;
    setAnchorEl(element);

    const top = window.pageYOffset + element.getBoundingClientRect().top;
    setVerticalOffset(calculateVerticalOffset(top));
  };

  const handleClose = () => {
    setAnchorEl(null);
    setVerticalOffset(0);
  };

  const handleDeleteTweet = () => {
    Nui.send('phone:deleteTweet', id);
    handleClose();
  };

  const allowedToDelete = config.twitter.allowDeleteTweets && isMine;
  const allowedToReport = config.twitter.allowReportTweets && !isMine;

  // if the user cannot perform any actions in show more then don't
  // allow them to interact with it
  let _handleClick =
    allowedToDelete || allowedToReport ? handleClick : () => null;

  return (
    <>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={_handleClick}
      >
        <MoreIcon />
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: verticalOffset,
          horizontal: 'left',
        }}
      >
        {allowedToDelete && (
          <MenuItem onClick={handleDeleteTweet}>
            {t('APPS_TWITTER_DELETE')}
          </MenuItem>
        )}
        {allowedToReport && (
          <ReportButton
            handleClose={handleClose}
            isReported={isReported}
            tweetId={id}
          />
        )}
      </Menu>
    </>
  );
};

export default ShowMore;
