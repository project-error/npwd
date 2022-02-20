import { EUseHookValues, useHookValues } from '@common/hooks/useHookValues';
import { Button, Stack } from '@mui/material';
import ImageField from '@ui/components/fields/ImageField';
import PriceField from '@ui/components/fields/PriceField';
import { TextField } from '@ui/components/Input';
import { i18n } from 'i18next';
import { Controller, RegisterOptions, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const getRules = (t: i18n['t']): RegisterOptions => ({
  required: {
    value: true,
    message: t('ERRORS.FIELD_IS_REQUIRED'),
  },
  maxLength: {
    value: 255,
    message: t('ERRORS.FIELD_IS_TOO_LONG'),
  },
});

export interface IListingFormValues {
  title: string;
  price: string | number;
  url: string;
  description: string;
}

interface MarketplaceFormProps {
  initialValues?: Partial<IListingFormValues>;
  onSubmit(values: IListingFormValues): void;
}
const MarketplaceForm = ({ onSubmit, initialValues }: MarketplaceFormProps) => {
  const { t } = useTranslation();
  const rules = getRules(t);

  const { handleSubmit, control, setValue, getValues } = useForm<IListingFormValues>({
    defaultValues: {
      title: '',
      url: '',
      description: '',
      price: '',
      ...initialValues,
    },
  });

  /* Keep form persistent */
  useHookValues<IListingFormValues>(EUseHookValues.MARKETPLACE, getValues, setValue);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={null}
              inputRef={field.ref}
              placeholder={t('MARKETPLACE.FORM_TITLE')}
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="url"
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <ImageField
              {...field}
              fullWidth
              ref={null}
              inputRef={field.ref}
              placeholder={t('MARKETPLACE.FORM_IMAGE')}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              onSelectImage={(image) => {
                if (!image) {
                  return;
                }

                setTimeout(() => {
                  setValue('url', image);
                }, 0);
              }}
            />
          )}
        />

        <Controller
          name="price"
          rules={rules}
          control={control}
          render={({ field, fieldState }) => (
            <PriceField
              {...field}
              ref={null}
              inputRef={field.ref}
              placeholder={t('MARKETPLACE.FORM_PRICE')}
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              ref={null}
              inputRef={field.ref}
              multiline
              fullWidth
              rows={6}
              variant="outlined"
              placeholder={t('MARKETPLACE.FORM_DESCRIPTION')}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button variant="contained" type="submit">
          {t('MARKETPLACE.POST_LISTING')}
        </Button>
      </Stack>
    </form>
  );
};

export default MarketplaceForm;
