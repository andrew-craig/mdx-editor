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
 * Serialized form of an InsertionNode
 */
export type SerializedInsertionNode = Spread<
  {
    text: string
    type: 'track-change-insertion'
    version: 1
  },
  SerializedLexicalNode
>

/**
 * A Lexical node representing inserted text in track changes view.
 * Renders with green background and underline styling.
 */
export class InsertionNode extends DecoratorNode<JSX.Element> {
  __text: string

  static getType(): string {
    return 'track-change-insertion'
  }

  static clone(node: InsertionNode): InsertionNode {
    return new InsertionNode(node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedInsertionNode): InsertionNode {
    return $createInsertionNode(serializedNode.text)
  }

  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__text = text
  }

  exportJSON(): SerializedInsertionNode {
    return {
      text: this.__text,
      type: 'track-change-insertion',
      version: 1
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const className = config.theme.trackChangeInsertion
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

  decorate(_parentEditor: LexicalEditor): JSX.Element {
    return <span className={styles.insertion}>{this.__text}</span>
  }
}

/**
 * Creates an InsertionNode with the given text
 */
export function $createInsertionNode(text: string): InsertionNode {
  return new InsertionNode(text)
}

/**
 * Type guard to check if a node is an InsertionNode
 */
export function $isInsertionNode(node: LexicalNode | null | undefined): node is InsertionNode {
  return node instanceof InsertionNode
}
