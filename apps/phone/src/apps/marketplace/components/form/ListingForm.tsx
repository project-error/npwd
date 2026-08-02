import React, { useCallback, useEffect } from 'react';
import { Image } from 'lucide-react';
import {
  MarketplaceResp,
  MarketplaceDatabaseLimits,
  MarketplaceEvents,
} from '@typings/marketplace';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { TextField } from '@ui/components/Input';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useForm } from '../../hooks/state';
import { useWordFilter } from '@os/wordfilter/hooks/useWordFilter';
import { Button } from '@ui/components/Button';
import { cn } from '@utils/css';
import { MARKETPLACE_APP_PRIMARY_COLOR } from '../../marketplace.theme';

export const ListingForm: React.FC = () => {
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const query = useQueryParams();
  const [formState, setFormState] = useForm();
  const { clean } = useWordFilter();

  const areFieldsFilled = formState.title.trim() !== '' && formState.description.trim() !== '';

  const addListing = () => {
    if (!areFieldsFilled) {
      return addAlert({
        message: t('MARKETPLACE.FEEDBACK.REQUIRED_FIELDS'),
        type: 'error',
      });
    }

    fetchNui<ServerPromiseResp<MarketplaceResp>>(MarketplaceEvents.ADD_LISTING, {
      ...formState,
      title: clean(formState.title),
      description: clean(formState.description),
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg),
          type: 'error',
        });
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.CREATE_LISTING_SUCCESS'),
        type: 'success',
      });
      navigate('/marketplace');
      setFormState({
        title: '',
        description: '',
        url: '',
      });
    });
  };

  const handleChooseImage = useCallback(() => {
    navigate(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [navigate, pathname, search]);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === MarketplaceDatabaseLimits.title) return;
    setFormState({
      ...formState,
      title: e.currentTarget.value,
    });
  };

  const handleUrlChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === MarketplaceDatabaseLimits.url) return;
    setFormState({
      ...formState,
      url: e.currentTarget.value,
    });
  };

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === MarketplaceDatabaseLimits.description) return;
    setFormState({
      ...formState,
      description: e.currentTarget.value,
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    setFormState({
      ...formState,
      url: query.image,
    });
    navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
  }, [query?.image, navigate, pathname, search, setFormState, formState]);

  return (
    <div className="mx-auto w-full text-center">
      <h1 className="text-keyos-fg">{t('MARKETPLACE.NEW_LISTING')}</h1>
      <TextField
        className="mb-6"
        value={formState.title}
        error={formState.title.length >= MarketplaceDatabaseLimits.title}
        onChange={handleTitleChange}
        label={t('GENERIC.REQUIRED')}
        placeholder={t('MARKETPLACE.FORM_TITLE')}
        inputProps={{
          className: 'text-[22px]',
          maxLength: 25,
        }}
        style={{ width: '80%' }}
        size="medium"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <div className="flex items-center pl-5">
        <Image />
        <Button onClick={handleChooseImage} variant="text">
          {t('MARKETPLACE.CHOOSE_IMAGE')}
        </Button>
      </div>
      <TextField
        className="mb-6"
        placeholder={t('MARKETPLACE.FORM_IMAGE')}
        value={formState.url}
        error={formState.url.length >= MarketplaceDatabaseLimits.url}
        onChange={handleUrlChange}
        inputProps={{ className: 'text-[22px]' }}
        style={{ width: '80%' }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className="mb-6"
        onChange={handleDescriptionChange}
        label={t('GENERIC.REQUIRED')}
        value={formState.description}
        error={formState.description.length >= MarketplaceDatabaseLimits.description}
        placeholder={t('MARKETPLACE.FORM_DESCRIPTION')}
        inputProps={{
          className: 'text-xl',
          maxLength: 130,
        }}
        style={{ width: '80%' }}
        size="medium"
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        rows={4}
        variant="outlined"
      />
      <Button
        onClick={addListing}
        className={cn(
          'mx-auto block w-4/5 text-xl text-white',
          !areFieldsFilled && 'opacity-50',
        )}
        style={{ background: MARKETPLACE_APP_PRIMARY_COLOR }}
        disabled={!areFieldsFilled}
      >
        {t('MARKETPLACE.POST_LISTING')}
      </Button>
    </div>
  );
};
