import { JSX } from 'react'
import {
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from 'lexical'
import styles from './trackchanges.module.css'

/**
 * Serialized form of a DeletionNode
 */
export type SerializedDeletionNode = Spread<
  {
    text: string
    type: 'track-change-deletion'
    version: 1
  },
  SerializedLexicalNode
>

/**
 * A Lexical node representing deleted text in track changes view.
 * Renders with red background and strikethrough styling.
 * This node is not selectable or editable.
 */
export class DeletionNode extends DecoratorNode<JSX.Element> {
  __text: string

  static getType(): string {
    return 'track-change-deletion'
  }

  static clone(node: DeletionNode): DeletionNode {
    return new DeletionNode(node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedDeletionNode): DeletionNode {
    return $createDeletionNode(serializedNode.text)
  }

  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__text = text
  }

  exportJSON(): SerializedDeletionNode {
    return {
      text: this.__text,
      type: 'track-change-deletion',
      version: 1
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const className = config.theme.trackChangeDeletion
    if (className) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getText(): string {
    return this.__text
  }

  setText(text: string): void {
    this.getWritable().__text = text
  }

  isInline(): true {
    return true
  }

  /**
   * Deletion nodes should not be selectable via keyboard
   */
  isKeyboardSelectable(): boolean {
    return false
  }

  decorate(_parentEditor: LexicalEditor): JSX.Element {
    return <span className={styles.deletion}>{this.__text}</span>
  }
}

/**
 * Creates a DeletionNode with the given text
 */
export function $createDeletionNode(text: string): DeletionNode {
  return new DeletionNode(text)
}

/**
 * Type guard to check if a node is a DeletionNode
 */
export function $isDeletionNode(node: LexicalNode | null | undefined): node is DeletionNode {
  return node instanceof DeletionNode
}
