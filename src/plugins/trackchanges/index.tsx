import { realmPlugin } from '../../RealmWithPlugins'
import { addEditorWrapper$, addLexicalNode$, addExportVisitor$ } from '../core'
import { InsertionNode } from './InsertionNode'
import { DeletionNode } from './DeletionNode'
import { LexicalInsertionVisitor } from './LexicalInsertionVisitor'
import { LexicalDeletionVisitor } from './LexicalDeletionVisitor'
import { TrackChangesWrapper } from './TrackChangesWrapper'
import { trackChangesBaseline$, trackChangesEnabled$ } from './cells'

// Re-export nodes and utilities
export { InsertionNode, $createInsertionNode, $isInsertionNode } from './InsertionNode'
export { DeletionNode, $createDeletionNode, $isDeletionNode } from './DeletionNode'
export { computeWordDiff } from './diffAlgorithm'
export type { DiffSegment } from './diffAlgorithm'

// Re-export cells
export { trackChangesBaseline$, trackChangesEnabled$ } from './cells'

/**
 * Parameters for the track changes plugin.
 * @group Track Changes
 */
export interface TrackChangesPluginParams {
  /**
   * The baseline markdown to compare against.
   * @default ''
   */
  baselineMarkdown?: string
  /**
   * Whether track changes mode is initially enabled.
   * @default false
   */
  enabled?: boolean
}

/**
 * A plugin that displays document changes inline using track changes visual style.
 * Shows insertions with green/underline and deletions with red/strikethrough.
 *
 * @example
 * ```tsx
 * <MDXEditor
 *   markdown={currentMarkdown}
 *   plugins={[
 *     trackChangesPlugin({
 *       baselineMarkdown: originalMarkdown,
 *       enabled: true
 *     })
 *   ]}
 * />
 * ```
 *
 * @group Track Changes
 */
export const trackChangesPlugin = realmPlugin<TrackChangesPluginParams>({
  init(r, params) {
    r.pubIn({
      [trackChangesBaseline$]: params?.baselineMarkdown ?? '',
      [trackChangesEnabled$]: params?.enabled ?? false,
      [addLexicalNode$]: [InsertionNode, DeletionNode],
      [addExportVisitor$]: [LexicalInsertionVisitor, LexicalDeletionVisitor],
      [addEditorWrapper$]: TrackChangesWrapper
    })
  },

  update(r, params) {
    r.pubIn({
      [trackChangesBaseline$]: params?.baselineMarkdown ?? '',
      [trackChangesEnabled$]: params?.enabled ?? false
    })
  }
})
