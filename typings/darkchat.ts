export interface ChannelItemProps {
  id: number;
  label: string;
  identifier: string;
  lastMessage: string;
}

// TODO: images
export interface ChannelMessageProps {
  id: number;
  message: string;
  isMine: boolean;
  createdAt: string;
}
