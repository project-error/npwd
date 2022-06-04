import {
  $getPreviousSelection,
  $getSelection,
  $isRangeSelection,
  DecoratorNode,
  LexicalEditor,
  TextNode,
} from 'lexical';
import { $createImageNode, $isImageNode } from '../nodes/ImageNode';
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const images: string[] = [];

function findAndTransformImage(node: DecoratorNode): null | DecoratorNode<JSX.Element> {
  const text = node.getTextContent();
  const URL_MATCHER =
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  const m = text.match(URL_MATCHER);

  if (m) {
    const selection = $getPreviousSelection();
    if ($isRangeSelection(selection)) {
      const imageNode = $createImageNode(text);

      node.replace(imageNode);
      images.push(text);

      return $isImageNode(node) ? imageNode : null;
    }
    return null;
  }
}

const useImages = (editor: LexicalEditor) => {
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, findAndTransformImage);
  }, [editor]);
};

export const ImagesPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();

  useImages(editor);
  return null;
};
