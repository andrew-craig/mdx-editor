import * as Mdast from 'mdast'
import { LexicalExportVisitor } from '../../exportMarkdownFromLexical'
import { InsertionNode, $isInsertionNode } from './InsertionNode'

/**
 * Export visitor for InsertionNode.
 * Converts the insertion node to plain text in the markdown output.
 */
export const LexicalInsertionVisitor: LexicalExportVisitor<InsertionNode, Mdast.Text> = {
  testLexicalNode: $isInsertionNode,
  visitLexicalNode({ mdastParent, lexicalNode, actions }) {
    // Export the inserted text as plain text
    actions.appendToParent(mdastParent, {
      type: 'text',
      value: lexicalNode.getText()
    })
  }
}
