import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { styled } from '@mui/material';

const ImageInput = styled(TextField)({
  flex: '1 1 100%',
  padding: '10px 15px',
  marginTop: '15px',
});

export const ImagePrompt = ({ visible, value, handleChange }) => {
  const textFieldRef = useRef(null);
  const [t] = useTranslation();

  useEffect(() => {
    textFieldRef.current && textFieldRef.current.focus();
  }, [visible]);

  const handleImageChange = useCallback((e) => handleChange(e.target.value), [handleChange]);

  if (!visible) return null;
  return (
    <ImageInput
      value={value}
      inputProps={{
        style: {
          fontSize: '22px',
        },
      }}
      onChange={handleImageChange}
      multiline
      size="small"
      placeholder={t('TWITTER.IMAGE_PLACEHOLDER')}
      inputRef={textFieldRef}
    />
  );
};

export default memo(ImagePrompt);
