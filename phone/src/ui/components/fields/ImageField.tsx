import { useQueryParams } from '@common/hooks/useQueryParams';
import { Image } from '@mui/icons-material';
import { IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import qs from 'qs';
import { ChangeEventHandler, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TextField } from '../Input';

type ImageFieldProps = {
  onSelectImage?(image: string): void;
} & TextFieldProps;

const ImageField = ({ onChange, onSelectImage, ...props }: ImageFieldProps) => {
  const { pathname } = useLocation();
  const { image } = useQueryParams<{ image: string }>();
  const { push } = useHistory();
  const { path } = useApp('CAMERA');

  useEffect(() => {
    onSelectImage?.(image);
  }, [image, onSelectImage]);

  const handleImageSelect = () => {
    const search = qs.stringify({
      referal: pathname,
    });

    push(`${path}?${search}`);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event);
  };

  return (
    <>
      <TextField
        {...props}
        ref={null}
        variant={props.variant}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleImageSelect} aria-label="image-button">
                <Image />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default ImageField;
