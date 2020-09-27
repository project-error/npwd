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
  showCreateTweetModal: atom({
    key: "showCreateTweetModal",
    default: false,
  }),
  modalMessage: atom({
    key: "modalMessage",
    default: "",
  }),
  createTweetLoading: atom({
    key: "createTweetLoading",
    default: false,
  }),
  createTweetSuccess: atom({
    key: "createTweetSuccess",
    default: null,
  }),
  updateProfileLoading: atom({
    key: "createTweetLoading",
    default: false,
  }),
  updateProfileSuccess: atom({
    key: "createTweetSuccess",
    default: null,
  }),
};
