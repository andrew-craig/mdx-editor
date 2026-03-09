import React from 'react'
import { useCellValues } from '@mdxeditor/gurx'
import { markdown$ } from '../core'
import { trackChangesBaseline$, trackChangesEnabled$ } from './cells'
import { computeWordDiff, DiffSegment } from './diffAlgorithm'
import styles from './trackchanges.module.css'

/**
 * Renders a single diff segment with appropriate styling
 */
const DiffSegmentView: React.FC<{ segment: DiffSegment }> = ({ segment }) => {
  switch (segment.type) {
    case 'insert':
      return <span className={styles.insertion}>{segment.value}</span>
    case 'delete':
      return <span className={styles.deletion}>{segment.value}</span>
    case 'equal':
    default:
      return <>{segment.value}</>
  }
}

/**
 * Renders a paragraph with diff highlighting
 */
const DiffParagraph: React.FC<{ oldText: string; newText: string }> = ({ oldText, newText }) => {
  const segments = computeWordDiff(oldText, newText)
  return (
    <p>
      {segments.map((segment, index) => (
        <DiffSegmentView key={index} segment={segment} />
      ))}
    </p>
  )
}

/**
 * Splits markdown into paragraphs, preserving empty lines
 */
function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\n+/)
}

/**
 * Simple paragraph matching using longest common subsequence
 * Returns pairs of [oldIndex, newIndex] for matching paragraphs
 * -1 indicates no match (deleted or inserted paragraph)
 */
function matchParagraphs(oldParagraphs: string[], newParagraphs: string[]): [number, number][] {
  const result: [number, number][] = []

  // Build a simple matching based on content similarity
  const usedOld = new Set<number>()
  const usedNew = new Set<number>()

  // First pass: exact matches
  for (let i = 0; i < newParagraphs.length; i++) {
    for (let j = 0; j < oldParagraphs.length; j++) {
      if (!usedOld.has(j) && newParagraphs[i] === oldParagraphs[j]) {
        result.push([j, i])
        usedOld.add(j)
        usedNew.add(i)
        break
      }
    }
  }

  // Second pass: fuzzy matches (paragraphs that share significant content)
  for (let i = 0; i < newParagraphs.length; i++) {
    if (usedNew.has(i)) continue

    let bestMatch = -1
    let bestScore = 0

    for (let j = 0; j < oldParagraphs.length; j++) {
      if (usedOld.has(j)) continue

      // Simple similarity: shared words ratio
      const oldWords = new Set(oldParagraphs[j].toLowerCase().split(/\s+/))
      const newWords = newParagraphs[i].toLowerCase().split(/\s+/)
      const sharedCount = newWords.filter((w) => oldWords.has(w)).length
      const score = sharedCount / Math.max(oldWords.size, newWords.length)

      if (score > 0.3 && score > bestScore) {
        bestScore = score
        bestMatch = j
      }
    }

    if (bestMatch !== -1) {
      result.push([bestMatch, i])
      usedOld.add(bestMatch)
      usedNew.add(i)
    }
  }

  // Add unmatched old paragraphs as deletions
  for (let j = 0; j < oldParagraphs.length; j++) {
    if (!usedOld.has(j)) {
      result.push([j, -1])
    }
  }

  // Add unmatched new paragraphs as insertions
  for (let i = 0; i < newParagraphs.length; i++) {
    if (!usedNew.has(i)) {
      result.push([-1, i])
    }
  }

  // Sort by position (prioritize new paragraph order, then old)
  result.sort((a, b) => {
    const aPos = a[1] !== -1 ? a[1] : a[0] + 0.5
    const bPos = b[1] !== -1 ? b[1] : b[0] + 0.5
    return aPos - bPos
  })

  return result
}

/**
 * The main track changes viewer component.
 * Displays the diff between baseline and current markdown inline.
 */
export const TrackChangesViewer: React.FC = () => {
  const [currentMarkdown, baseline, enabled] = useCellValues(markdown$, trackChangesBaseline$, trackChangesEnabled$)

  if (!enabled) {
    return null
  }

  const oldParagraphs = splitIntoParagraphs(baseline)
  const newParagraphs = splitIntoParagraphs(currentMarkdown)
  const matches = matchParagraphs(oldParagraphs, newParagraphs)

  return (
    <div className="mdxeditor-track-changes-viewer">
      {matches.map(([oldIdx, newIdx], index) => {
        if (oldIdx === -1) {
          // Entirely new paragraph
          return (
            <p key={`new-${index}`}>
              <span className={styles.insertion}>{newParagraphs[newIdx]}</span>
            </p>
          )
        }

        if (newIdx === -1) {
          // Deleted paragraph
          return (
            <p key={`del-${index}`}>
              <span className={styles.deletion}>{oldParagraphs[oldIdx]}</span>
            </p>
          )
        }

        // Modified or unchanged paragraph
        return <DiffParagraph key={`match-${index}`} oldText={oldParagraphs[oldIdx]} newText={newParagraphs[newIdx]} />
      })}
    </div>
  )
}
