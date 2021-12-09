import { FormattedMatch } from '../../../../../typings/match';
import { FormattedTweet } from '../../../../../typings/twitter';

export const IMG_DEFAULT_AVATAR = 'https://i.file.glass/QrEvq.png';
export const IMG_INVALID_AVATAR = 'media/twitter/invalid.png';
export const APP_TWITTER = 'TWITTER';

export const SETTING_MENTIONS = 'mentions';
export const SETTINGS_ALL_TWEETS = 'all';

export const MockTwitterProfile = {
  id: 1,
  profile_name: 'npwd admin',
  identifier: '421431414441124124',
  avatar_url:
    'https://libertycity.net/uploads/download/gta5_newskins/fulls/9kfhpadblk227v1tocv8mmgod3/1542874685734_653468-4.jpg',
  bio: 'Please no ERP',
  location: 'In my admin car',
  job: '',
  createdAt: '2021-12-01 00:11:30',
  updatedAt: '2021-12-01 00:11',
};

export const MockTweets: FormattedTweet[] = [
  {
    profile_name: 'chip',
    profile_id: 29,
    isMine: true,
    isLiked: false,
    retweetId: '',
    isRetweet: false,
    seconds_since_tweet: 16,
    retweetProfileName: '',
    retweetAvatarUrl: '',
    isReported: false,
    retweetIdentifier: '',
    avatar_url:
      'https://libertycity.net/uploads/download/gta5_newskins/fulls/9kfhpadblk227v1tocv8mmgod3/1542874685734_653468-4.jpg',
    id: 111,
    message: 'hello',
    createdAt: '2021-12-01 00:42:03',
    updatedAt: '2021-12-01 00:42:03',
    identifier: '298347827237rweffffweo8874',
    images: [],
    retweet: null,
  },
  {
    profile_name: 'taso',
    profile_id: 28,
    isMine: false,
    isLiked: true,
    retweetId: '',
    isRetweet: false,
    seconds_since_tweet: 1639,
    retweetProfileName: '',
    retweetAvatarUrl: '',
    isReported: false,
    retweetIdentifier: '',
    avatar_url: '',
    id: 112,
    message: 'Angular is best',
    createdAt: '2021-12-01 00:42:03',
    updatedAt: '2021-12-01 00:42:03',
    identifier: 'sdfjsadfafjadfjas',
    images: [],
    retweet: null,
  },
  {
    profile_name: 'Rocky',
    profile_id: 30,
    isMine: false,
    isLiked: false,
    retweetId: '',
    isRetweet: false,
    seconds_since_tweet: 1639,
    retweetProfileName: '',
    retweetAvatarUrl: '',
    isReported: false,
    retweetIdentifier: '',
    avatar_url: '',
    id: 110,
    message: 'let me introduce weeb core',
    createdAt: '2021-12-01 00:42:03',
    updatedAt: '2021-12-01 00:42:03',
    identifier: 'sadjfwr23472974',
    images: [
      {
        id: '1',
        link: 'https://c.tenor.com/ucmhE4FHoFcAAAAC/fight-smash.gif',
      },
    ],
    retweet: null,
  },
];
