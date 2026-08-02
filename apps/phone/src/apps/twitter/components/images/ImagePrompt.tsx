import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { Tooltip } from '@ui/components/Tooltip';
import { ImagePlus } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { useLocation, useNavigate } from 'react-router';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';

export const ImagePrompt = ({ visible, value, handleChange }) => {
  const textFieldRef = useRef(null);
  const [t] = useTranslation();
  const navigate = useNavigate();
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
    navigate(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [navigate, pathname, search]);

  useEffect(() => {
    if (!query?.image) return;
    handleChange(query.image, true);
    navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
  }, [query?.image, navigate, pathname, search, handleChange]);

  if (!visible) return null;
  return (
    <div className="flex items-center justify-between">
      <TextField
        className="mt-[15px] flex-[1_1_100%] px-[15px] py-[10px] [&_input::placeholder]:text-ellipsis"
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
      <Tooltip title="Select an image from your gallery">
        <NPWDButton size="icon" variant="ghost" onClick={handleChooseImage}>
          <ImagePlus size={20} />
        </NPWDButton>
      </Tooltip>
    </div>
  );
};

export default memo(ImagePrompt);
