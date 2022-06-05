import { EmojiNode } from './nodes/EmojiNode';
import { ImageNode } from './nodes/ImageNode';
import { MentionNode } from './nodes/MentionNode';

const editorTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
};

export const config = {
  theme: editorTheme,
  onError(error) {
    throw error;
  },
  nodes: [EmojiNode, ImageNode, MentionNode],
};
