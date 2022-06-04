import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import './editor.css';
import { EmojisPlugin } from '../../../../lexical/plugins/EmojisPlugin';
import { config } from '../../../../lexical/config';
import { ImagesPlugin } from '../../../../lexical/plugins/ImagePlugin';

export const TweetEditor: React.FC = () => {
  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  };

  const AutoFocusPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      editor.focus();
    }, [editor]);

    return null;
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div className="editor-placeholder">What's happening?</div>}
        />
        <OnChangePlugin onChange={onChange} />
        <ImagesPlugin />
        <EmojisPlugin />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
};
