import { atom } from "recoil";

export const twitterState = {
  profile: atom({
    key: "profile",
    default: null,
  }),
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
