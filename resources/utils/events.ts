export default {
  // Twitter
  TWITTER_FETCH_TWEETS: "phone:fetchTweets",
  TWITTER_FETCH_TWEETS_SUCCESS: "fetchTweets",
  TWITTER_FETCH_TWEETS_FAILURE: "fetchTweetsFailed",
  TWITTER_FETCH_TWEETS_FILTERED: "phone:fetchTweetsFiltered",
  TWITTER_FETCH_TWEETS_FILTERED_SUCCESS: "fetchTweetsFiltered",
  TWITTER_FETCH_TWEETS_FILTERED_FAILURE: "fetchTweetsFilteredFailed",
  TWITTER_GET_OR_CREATE_PROFILE: "phone:getOrCreateTwitterProfile",
  TWITTER_GET_OR_CREATE_PROFILE_SUCCESS: "getOrCreateTwitterProfile",
  TWITTER_GET_OR_CREATE_PROFILE_FAILURE: "getOrCreateTwitterProfileFailed",
  TWITTER_UPDATE_PROFILE: "phone:updateTwitterProfile",
  TWITTER_UPDATE_PROFILE_LOADING: "updateProfileLoading",
  TWITTER_UPDATE_PROFILE_RESULT: "updateProfileResult",
  TWITTER_CREATE_TWEET: "phone:createTweet",
  TWITTER_CREATE_TWEET_LOADING: "createTweetLoading",
  TWITTER_CREATE_TWEET_RESULT: "createTweetResult",
  TWITTER_CREATE_TWEET_BROADCAST: "createTweetBroadcast",
  TWITTER_CREATE_TWEET_FAILURE: "createTweetResultFailed",
  TWITTER_DELETE_TWEET: "phone:deleteTweet",
  TWITTER_DELETE_TWEET_SUCCESS: "deleteTweetSuccess",
  TWITTER_DELETE_TWEET_FAILURE: "deleteTweetFailed",
  TWITTER_TOGGLE_LIKE: "phone:toggleLike",
  TWITTER_TOGGLE_LIKE_SUCCESS: "toggleLikeSuccess",
  TWITTER_TOGGLE_LIKE_FAILURE: "toggleLikeFailed",
  TWITTER_REPORT: "phone:reportTweet",
  TWITTER_REPORT_SUCCESS: "reportTweetSuccess",
  TWITTER_REPORT_FAILURE: "reportTweetFailed",

  // Contacts
  CONTACTS_SEND_CONTACTS: 'phone:sendContacts',
  CONTACTS_GET_CONTACTS: 'phone:getContacts',
  CONTACTS_ADD_CONTACT_NUI: 'contacts:add',
  CONTACTS_ADD_CONTACT: 'contacts:add',
  CONTACTS_ADD_CONTACT_SUCCESS: 'contacts:addSuccess',
  CONTACTS_UPDATE_CONTACT: 'phone:updateContact',
  CONTACTS_DELETE_CONTACT: 'phone:deleteContact',
  CONTACTS_DELETE_CONTACT_SUCCESS: 'contacts:deleteSuccess',
  CONTACTS_UPDATE_CONTACT_SUCCESS: 'phone:updateContactSuccess',

  // Sellout
  SELLOUT_ADD_LISTING: 'phone:addListing',
  SELLOUT_FETCH_LISTING: 'phone:fetchAllListings',
  SELLOUT_SEND_LISTING: 'phone:sendAllListings',

  // Bank
  BANK_ADD_TRANSFER: 'phone:addTransfer',
  BANK_ADD_TRANSFER_SUCCESS: 'phone:addTransferSuccess',
  BANK_FETCH_TRANSACTIONS: 'phone:fetchAllTransactions',
  BANK_SEND_TRANSFERS: 'phone:sendTransfers',
  BANK_TRANSACTION_ALERT: 'phone:bankTransactionAlert',
  BANK_TRANSACTION_NOTIFICATION: 'phone:bankTransactionNotification',
  BANK_SEND_CREDENTIALS: 'phone:sendBankCredentials',
  BANK_GET_CREDENTIALS: 'phone:getBankCredentials',

  // Notes 
  NOTE_ADD_NOTE: 'phone:addNote',
  NOTE_FETCH_ALL_NOTES: 'phone:fetchAllNotes',
  NOTE_SEND_NOTE: 'phone:sendNote',
  NOTE_SEND_NOTE_SUCCESS: 'phone:sendNoteSuccess',
  NOTE_DELETE_NOTE: 'phone:deleteNote',
  NOTE_UPDATE_NOTE: 'phone:updateNote',
  NOTE_UPDATE_NOTE_SUCCESS: 'phone:updateNoteSuccess',
  NOTE_UPDATE_NOTE_FAILURE: 'phone:updateNoteFailure',

  // DO NOT CHANGE WHATS BELOW, PLEASE - CHIP
  OPEN_APP_CONTACTS: 'phone:app:CONTACTS',
  OPEN_APP_BANK: 'phone:app:BANK',
  OPEN_APP_NOTES: 'phone:app:NOTES',
  OPEN_APP_LISTINGS: 'phone:app:SELLOUT'

}
