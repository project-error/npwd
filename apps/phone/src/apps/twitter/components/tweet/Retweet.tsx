import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repeat } from 'lucide-react';

interface IProps {
  profileName: string;
}

function Retweet({ profileName }: IProps) {
  const [t] = useTranslation();
  return (
    <div className="-mt-1.5 mb-1.5 flex w-full items-start justify-start pb-2 text-base text-[color:var(--keyos-app-accent)]">
      <Repeat size={16} className="mr-1 mt-0.5 shrink-0" /> {profileName} {t('TWITTER.RETWEETED')}
    </div>
  );
}

export default Retweet;
