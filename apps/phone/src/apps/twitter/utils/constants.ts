import { Tweet } from '@typings/twitter';

export const IMG_DEFAULT_AVATAR = 'https://i.file.glass/QrEvq.png';
export const IMG_INVALID_AVATAR = 'media/twitter/invalid.png';
export const APP_TWITTER = 'TWITTER';

export const SETTING_MENTIONS = 'mentions';
export const SETTINGS_ALL_TWEETS = 'all';

export const MockTwitterProfile = {
  id: 1,
  profile_name: 'npwd admin',
  identifier: '421431414441124124',
  avatar_url: 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png',
  bio: 'Please no ERP',
  location: 'In my admin car',
  job: '',
  createdAt: '2021-12-01 00:11:30',
  updatedAt: '2021-12-01 00:11',
};

export const MockTweets: Tweet[] = [
  {
    profile_name: 'chip',
    profile_id: 29,
    isMine: true,
    likes: 0,
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
    likes: 3,
    retweetAvatarUrl: '',
    isReported: false,
    retweetIdentifier: '',
    avatar_url: '',
    id: 112,
    images: 'https://i.projecterror.dev/K45dbT6vsaKtxVMW4F66VZ.webp',
    message:
      "Exploring the wonders of our world 🌍 and beyond 🚀! From the depths of the ocean to the mysteries of space, there's so much to discover. Let's cherish our planet, promote science and education, and work together for a sustainable future. #DiscoverEarth #ScienceForAll 🌱🔭",
    createdAt: '2021-12-01 00:42:03',
    updatedAt: '2021-12-01 00:42:03',
    identifier: 'sdfjsadfafjadfjas',
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
    likes: 123,
    avatar_url: '',
    id: 110,
    message: 'let me introduce weeb core',
    createdAt: '2021-12-01 00:42:03',
    updatedAt: '2021-12-01 00:42:03',
    identifier: 'sadjfwr23472974',
    images: 'https://c.tenor.com/ucmhE4FHoFcAAAAC/fight-smash.gif',
    retweet: null,
  },
];
