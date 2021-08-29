import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles, Button, Box } from '@material-ui/core';
import { MarketplaceEvents, MarketplaceListing } from '../../../../../../typings/marketplace';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@material-ui/icons/Image';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '../../../../common/utils/deleteQueryFromLocation';
import { TextField } from '../../../../ui/components/Input';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';

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
    background: theme.palette.primary.main,
    width: '80%',
    fontSize: 20,
  },
}));

export const ListingForm: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const addListing = () => {
    if (title !== '' && description !== '') {
      fetchNui<ServerPromiseResp<MarketplaceListing[]>>(MarketplaceEvents.ADD_LISTING, {
        title,
        description,
        url,
      }).then((resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('APPS_MARKETPLACE_CREATE_LISTING_FAILED'),
            type: 'error',
          });
        }

        addAlert({
          message: t('APPS_MARKETPLACE_CREATE_LISTING_SUCCESS'),
          type: 'success',
        });
        history.push('/marketplace');
      });
    } else {
      addAlert({
        message: t('APPS_MARKETPLACE_REQUIRED_FIELDS'),
        type: 'error',
      });
    }
  };

  /*const handleChooseImage = () => {
		history.push(`/camera?${qs.stringify({
			referal: encodeURIComponent(pathname + search),
		})}`)
	}*/

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

  useEffect(() => {
    if (!query?.image) return;
    setUrl(query?.image);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query?.image, history, pathname, search]);

  return (
    <div className={classes.root}>
      <h1>New Listing</h1>
      <TextField
        className={classes.input}
        onChange={(e) => setTitle(e.target.value)}
        label={t('GENERIC_REQUIRED')}
        placeholder={t('APPS_MARKETPLACE_FORM_TITLE')}
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
          <Button onClick={handleChooseImage}>Choose a image</Button>
        </div>
      </Box>
      <TextField
        className={classes.input}
        placeholder={t('APPS_MARKETPLACE_FORM_IMAGE')}
        value={url}
        onChange={(e) => setUrl(e.currentTarget.value)}
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: '80%' }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className={classes.input}
        onChange={(e) => setDescription(e.target.value)}
        label={t('GENERIC_REQUIRED')}
        placeholder={t('APPS_MARKETPLACE_FORM_DESCRIPTION')}
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
      <Button onClick={addListing} className={classes.postButton}>
        Post
      </Button>
    </div>
  );
};
