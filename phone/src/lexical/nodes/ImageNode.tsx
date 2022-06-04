import { DecoratorNode, EditorConfig, LexicalEditor, LexicalNode, NodeKey } from 'lexical';

export class ImageNode extends DecoratorNode<JSX.Element> {
  private readonly __src: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(prevNode: unknown, dom: HTMLElement, config: EditorConfig): boolean {
    /*const inner = dom.firstChild;
    if (inner === null ) {
      return true;
    }
    super.updateDOM(prevNode, dom, config);*/
    return false;
  }

  decorate(editor: LexicalEditor): any {
    return <img alt="some shit" height={200} width={200} src={this.__src} />;
  }
}

export function $createImageNode(src: string): ImageNode {
  return new ImageNode(src);
}

export function $isImageNode(node?: LexicalNode): boolean {
  return node instanceof ImageNode;
}
