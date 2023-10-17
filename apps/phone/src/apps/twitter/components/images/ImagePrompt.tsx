import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { IconButton, styled, Tooltip } from '@mui/material';
import { Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';

const ImageInput = styled(TextField)({
  flex: '1 1 100%',
  padding: '10px 15px',
  marginTop: '15px',
  '&::placeholder': {
    textOverflow: 'ellipsis',
  },
});

export const ImagePrompt = ({ visible, value, handleChange }) => {
  const textFieldRef = useRef(null);
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

  useEffect(() => {
    textFieldRef.current && textFieldRef.current.focus();
  }, [visible]);

  const handleImageChange = useCallback(
    (e, shouldSubmit) => handleChange(e.target.value, shouldSubmit),
    [handleChange],
  );

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

  useEffect(() => {
    if (!query?.image) return;
    handleChange(query.image, true);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, handleChange]);

  if (!visible) return null;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <ImageInput
        value={value}
        inputProps={{
          style: {
            fontSize: '18px',
          },
        }}
        onChange={(e) => handleImageChange(e, false)}
        multiline
        size="small"
        placeholder={t('TWITTER.IMAGE_PLACEHOLDER')}
        inputRef={textFieldRef}
      />
      <Tooltip placement="left" title="Select an image from your gallery">
        <IconButton onClick={handleChooseImage}>
          <AddPhotoAlternateIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default memo(ImagePrompt);
