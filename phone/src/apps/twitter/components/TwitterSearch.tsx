import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import TweetList from './tweet/TweetList';
import { useNuiRequest } from 'fivem-nui-react-lib';
import SearchButton from './buttons/SearchButton';
import { useFilteredTweets } from '../hooks/useFilteredTweets';
import { TwitterEvents } from '../../../../../typings/twitter';

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
  const Nui = useNuiRequest();
  const classes = useStyles();
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const { tweets } = useFilteredTweets();

  const handleChange = (e) => setSearchValue(e.target.value);

  const handleSubmit = () => {
    const cleanedSearchValue = searchValue.trim();
    if (!cleanedSearchValue) return;

    Nui.send(TwitterEvents.FETCH_TWEETS_FILTERED, cleanedSearchValue);
  };

  const filteredTweets = tweets || [];

  return (
    <>
      <div className={classes.root}>
        <div className={classes.searchContainer}>
          <TextField
            className={classes.search}
            placeholder={t('APPS_TWITTER_SEARCH_TWEETS_PLACEHOLDER')}
            label={t('APPS_TWITTER_SEARCH_TWEETS')}
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
