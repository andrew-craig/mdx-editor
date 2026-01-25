# Track Changes Plugin

This plugin displays document changes inline using the "track changes" visual style (like Microsoft Word), showing insertions with underline/green and deletions with strikethrough/red.

**Key difference from diff-source plugin:** The diff-source plugin shows changes in a side-by-side CodeMirror text view. This track changes plugin shows changes inline.

## Architecture

### Core Concept
- Compare baseline markdown against current markdown using word-level diff
- Render differences with visual styling (green/underline for insertions, red/strikethrough for deletions)
- Editor is hidden when track changes view is active (view-only mode)

### Implementation Approach
- Uses a dedicated `TrackChangesViewer` React component that renders the diff
- `TrackChangesWrapper` switches between normal editor and track changes view
- Word-level diff algorithm provides good balance of precision and readability

## Files

| File | Purpose |
|------|---------|
| `index.tsx` | Plugin entry point with realmPlugin, exports |
| `cells.ts` | Gurx cells for state management |
| `InsertionNode.tsx` | DecoratorNode for inserted text (green/underline) |
| `DeletionNode.tsx` | DecoratorNode for deleted text (red/strikethrough) |
| `diffAlgorithm.ts` | Word-level diff implementation using LCS |
| `TrackChangesViewer.tsx` | React component that renders the diff view |
| `TrackChangesWrapper.tsx` | Wrapper that switches between editor and diff view |
| `LexicalInsertionVisitor.ts` | Export visitor (outputs plain text) |
| `LexicalDeletionVisitor.ts` | Export visitor (outputs nothing) |
| `trackchanges.module.css` | Styling for insertion/deletion marks |

## Usage

```tsx
import { MDXEditor, trackChangesPlugin } from '@mdxeditor/editor'

<MDXEditor
  markdown={currentMarkdown}
  plugins={[
    trackChangesPlugin({
      baselineMarkdown: originalMarkdown,
      enabled: true
    })
  ]}
/>
```

## Plugin Parameters

```typescript
interface TrackChangesPluginParams {
  /** The baseline markdown to compare against */
  baselineMarkdown?: string
  /** Whether track changes is initially enabled */
  enabled?: boolean
}
```

## Gurx State Cells

| Cell | Type | Purpose |
|------|------|---------|
| `trackChangesBaseline$` | `Cell<string>` | The baseline markdown to compare against |
| `trackChangesEnabled$` | `Cell<boolean>` | Whether track changes mode is enabled |

## Custom Lexical Nodes

### InsertionNode
- Extends `DecoratorNode`
- Renders text with green background and underline
- `isInline(): true`

### DeletionNode
- Extends `DecoratorNode`
- Renders text with red background and strikethrough
- `isInline(): true`
- `isKeyboardSelectable(): false` (non-editable)

## Diff Algorithm

The `diffAlgorithm.ts` implements word-level diffing:
1. Tokenizes text into words and whitespace
2. Uses Longest Common Subsequence (LCS) to find matching sequences
3. Produces segments of type `insert`, `delete`, or `equal`
4. Merges consecutive segments of the same type

## Paragraph Matching

The `TrackChangesViewer` implements paragraph-level matching:
1. Splits documents into paragraphs
2. First pass: finds exact matches
3. Second pass: fuzzy matches based on shared word ratio (threshold: 30%)
4. Unmatched paragraphs shown as fully inserted/deleted
5. Matched paragraphs get word-level diff

## Edge Cases

| Element | Strategy |
|---------|----------|
| Paragraphs | Matched by content similarity, then word-level diff within |
| Empty content | All content shows as inserted or deleted |
| Whitespace | Preserved in diff output |

## Future Enhancements

- Accept/reject individual changes
- Toolbar toggle button component
- Support for structured elements (tables, code blocks, images)
- Author and timestamp tracking
