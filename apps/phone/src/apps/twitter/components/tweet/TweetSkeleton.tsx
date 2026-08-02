import React from 'react';

export default function TweetSkeleton() {
  return (
    <>
      <div className="mb-[3px] mt-[3px] flex w-full flex-row flex-nowrap p-[15px]">
        <div>
          <div className="size-[60px] animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="-mt-5 ml-[15px]">
          <div className="mb-2 h-4 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-[118px] w-[250px] animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <hr className="border-neutral-200 dark:border-neutral-800" />
    </>
  );
}
