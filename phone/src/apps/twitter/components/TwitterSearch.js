import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import TweetList from "./TweetList";

import SearchButton from "./SearchButton";
import { useTweets } from "../hooks/useTweets";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  searchContainer: {
    padding: "15px",
  },
  search: {
    width: "100%",
  },
});

function TwitterSearch() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { tweets } = useTweets();
  const [searchValue, setSearchValue] = useState("");
  const [filteredTweets, setFilteredTweets] = useState(tweets);
  const handleChange = (e) => setSearchValue(e.target.value);

  const handleSubmit = () => {
    if (!searchValue.trim()) return;

    setFilteredTweets(
      tweets.filter((tweet) => {
        const v = searchValue.toLowerCase();
        return (
          tweet.profile_name.toLowerCase().includes(v) ||
          tweet.message.toLowerCase().includes(v)
        );
      })
    );
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.searchContainer}>
          <TextField
            className={classes.search}
            placeholder={t("APPS_TWITTER_SEARCH_TWEETS_PLACEHOLDER")}
            label={t("APPS_TWITTER_SEARCH_TWEETS")}
            value={searchValue}
            onChange={handleChange}
            size="medium"
            inputRef={(input) => input && input.focus()}
          />
        </div>
        <TweetList tweets={filteredTweets} />
      </div>
      <SearchButton handleClick={handleSubmit} />
    </>
  );
}

export default TwitterSearch;
