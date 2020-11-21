import React from "react";

import { List } from "../../../../ui/components/List";
import MessageSkeleton from "./MessageSkeleton";

export function MessageSkeletonList() {
  return (
    <List>
      <MessageSkeleton height={75} />
      <MessageSkeleton height={60} />
      <MessageSkeleton height={90} isMine/>
      <MessageSkeleton height={60} />
      <MessageSkeleton height={60} isMine />
      <MessageSkeleton height={100} />
      <MessageSkeleton height={75} isMine />
      <MessageSkeleton height={50} />
    </List>
  );
}

export default MessageSkeletonList;
