import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TweetList from './tweet/TweetList';
import SearchButton from './buttons/SearchButton';
import { TextField } from '@ui/components/Input';
import fetchNui from '@utils/fetchNui';
import { Tweet, TwitterEvents } from '@typings/twitter';
import { useFilteredTweets } from '../hooks/state';
import { processTweet } from '../utils/tweets';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { Box, styled } from '@mui/material';

const SearchRoot = styled(Box)({
  width: '100%',
});

const SearchContainer = styled(Box)({
  padding: '15px',
});

const SearchField = styled(TextField)({
  width: '100%',
});

function TwitterSearch() {
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
      <SearchRoot>
        <SearchContainer>
          <SearchField
            placeholder={t('TWITTER.SEARCH_TWEETS_PLACEHOLDER')}
            label={t('TWITTER.SEARCH_TWEETS')}
            value={searchValue}
            onChange={handleChange}
            size="medium"
            inputRef={(input) => input && input.focus()}
          />
        </SearchContainer>
        {filteredTweets.length > 0 && <TweetList tweets={tweets} />}
      </SearchRoot>
      <SearchButton handleClick={handleSubmit} />
    </>
  );
}

export default TwitterSearch;
