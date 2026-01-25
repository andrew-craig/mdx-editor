import * as Mdast from 'mdast'
import { LexicalExportVisitor } from '../../exportMarkdownFromLexical'
import { DeletionNode, $isDeletionNode } from './DeletionNode'

/**
 * Export visitor for DeletionNode.
 * Deletions are omitted from the markdown output (they represent removed content).
 */
export const LexicalDeletionVisitor: LexicalExportVisitor<DeletionNode, Mdast.Text> = {
  testLexicalNode: $isDeletionNode,
  visitLexicalNode() {
    // Deletions are not exported - they represent content that was removed
    // So we simply don't append anything to the parent
  }
}
