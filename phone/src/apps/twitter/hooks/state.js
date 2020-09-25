import { atom } from "recoil";

export const twitterState = {
  tweets: atom({
    key: "tweets",
    default: [],
  }),
  createTweetLoading: atom({
    key: "createTweetLoading",
    default: false,
  }),
  createTweetSuccess: atom({
    key: "createTweetSuccess",
    default: null,
  }),
};
