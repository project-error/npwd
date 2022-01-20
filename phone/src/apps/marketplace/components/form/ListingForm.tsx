import React, { useCallback, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  MarketplaceResp,
  MarketplaceDatabaseLimits,
  MarketplaceEvents,
} from '@typings/marketplace';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@mui/icons-material/Image';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { TextField } from '@ui/components/Input';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useForm } from '../../hooks/state';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: 'auto',
    textAlign: 'center',
  },
  input: {
    marginBottom: 25,
  },
  textFieldInput: {
    fontSize: 22,
  },
  multilineFieldInput: {
    fontSize: 20,
  },
  postButton: {
    display: 'block',
    margin: 'auto',
    color: 'white',
    background: theme.palette.primary.main,
    width: '80%',
    fontSize: 20,
  },
}));

export const ListingForm: React.FC = () => {
  const classes = useStyles();
  const [t] = useTranslation();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();
  const [formState, setFormState] = useForm();

  const areFieldsFilled = formState.title.trim() !== '' && formState.description.trim() !== '';

  const addListing = () => {
    if (!areFieldsFilled) {
      return addAlert({
        message: t('MARKETPLACE.FEEDBACK.REQUIRED_FIELDS'),
        type: 'error',
      });
    }

    fetchNui<ServerPromiseResp<MarketplaceResp>>(MarketplaceEvents.ADD_LISTING, formState).then(
      (resp) => {
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
        history.push('/marketplace');
        setFormState({
          title: '',
          description: '',
          url: '',
        });
      },
    );
  };

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

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
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search, setFormState, formState]);

  return (
    <div className={classes.root}>
      <h1>{t('MARKETPLACE.NEW_LISTING')}</h1>
      <TextField
        className={classes.input}
        value={formState.title}
        error={formState.title.length >= MarketplaceDatabaseLimits.title}
        onChange={handleTitleChange}
        label={t('GENERIC.REQUIRED')}
        placeholder={t('MARKETPLACE.FORM_TITLE')}
        inputProps={{
          className: classes.textFieldInput,
          maxLength: 25,
        }}
        style={{ width: '80%' }}
        size="medium"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Box display="flex" alignItems="center" paddingLeft={5}>
        <div>
          <ImageIcon />
        </div>
        <div>
          <Button onClick={handleChooseImage}>{t('MARKETPLACE.CHOOSE_IMAGE')}</Button>
        </div>
      </Box>
      <TextField
        className={classes.input}
        placeholder={t('MARKETPLACE.FORM_IMAGE')}
        value={formState.url}
        error={formState.url.length >= MarketplaceDatabaseLimits.url}
        onChange={handleUrlChange}
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: '80%' }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className={classes.input}
        onChange={handleDescriptionChange}
        label={t('GENERIC.REQUIRED')}
        value={formState.description}
        error={formState.description.length >= MarketplaceDatabaseLimits.description}
        placeholder={t('MARKETPLACE.FORM_DESCRIPTION')}
        inputProps={{
          className: classes.multilineFieldInput,
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
      <Button onClick={addListing} className={classes.postButton} disabled={!areFieldsFilled}>
        {t('MARKETPLACE.POST_LISTING')}
      </Button>
    </div>
  );
};
