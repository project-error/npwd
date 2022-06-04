import { EditorConfig, TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  private readonly __className: string;

  static getType() {
    return 'emoji';
  }

  static clone(node) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className, text, key?) {
    super(text, key);
    this.__className = className;
  }

  createDom(config) {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);

    dom.className = this.__className;
    inner.className = 'emoji-inner';
    dom.appendChild(inner);

    return dom;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }

    super.updateDOM(prevNode, dom, config);
    return false;
  }

  static importJSON(serializedNode: any): EmojiNode {
    const node = $createEmojiNode(serializedNode.className, serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): any {
    return {
      ...super.exportJSON(),
      className: this.getClassName(),
      type: 'emoji',
    };
  }

  getClassName(): string {
    const self = this.getLatest();
    return self.__className;
  }
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className, emojiText) {
  return new EmojiNode(className, emojiText).setMode('token');
}
