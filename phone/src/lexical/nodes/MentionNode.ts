import { EditorConfig, NodeKey, TextNode } from 'lexical';

export class MentionNode extends TextNode {
  private readonly __className: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__className, node.__text, node.__key);
  }

  constructor(className: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);

    dom.className = this.__className;
    inner.className = 'mention-inner';
    inner.style.color = 'blue';
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
}

export function $isMentionNode(node) {
  return node instanceof MentionNode;
}

export function $createMentionNode(className: string, mentionText: string) {
  return new MentionNode(className, mentionText).setMode('token');
}
