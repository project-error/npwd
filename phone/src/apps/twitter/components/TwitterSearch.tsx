import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import TweetList from './tweet/TweetList';
import SearchButton from './buttons/SearchButton';
import { TextField } from '@ui/components/Input';
import { fetchNui } from '../../../utils/fetchNui';
import { Tweet, TwitterEvents } from '@typings/twitter';
import { useFilteredTweets } from '../hooks/state';
import { processTweet } from '../utils/tweets';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  searchContainer: {
    padding: '15px',
  },
  search: {
    width: '100%',
  },
});

function TwitterSearch() {
  const classes = useStyles();
  const [t] = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { addAlert } = useSnackbar();

  // a bit weird name convention
  const [tweets, setFilteredTweets] = useFilteredTweets();

  const handleChange = (e) => setSearchValue(e.target.value);

  const handleSubmit = () => {
    const cleanedSearchValue = searchValue.trim();
    if (!cleanedSearchValue) return;

    fetchNui<ServerPromiseResp<Tweet[]>>(TwitterEvents.FETCH_TWEETS_FILTERED, {
      searchValue: cleanedSearchValue,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(''),
          type: 'error',
        });
      }

      setFilteredTweets(resp.data.map(processTweet));
    });
  };

  const filteredTweets = tweets || [];

  return (
    <>
      <div className={classes.root}>
        <div className={classes.searchContainer}>
          <TextField
            className={classes.search}
            placeholder={t('TWITTER.SEARCH_TWEETS_PLACEHOLDER')}
            label={t('TWITTER.SEARCH_TWEETS')}
            value={searchValue}
            onChange={handleChange}
            size="medium"
            inputRef={(input) => input && input.focus()}
          />
        </div>
        {filteredTweets.length > 0 && <TweetList tweets={tweets} />}
      </div>
      <SearchButton handleClick={handleSubmit} />
    </>
  );
}

export default TwitterSearch;
