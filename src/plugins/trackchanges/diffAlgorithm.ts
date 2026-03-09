/**
 * A segment of the diff result
 */
export interface DiffSegment {
  type: 'insert' | 'delete' | 'equal'
  value: string
}

/**
 * Tokenizes text into words and whitespace
 */
function tokenize(text: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inWord = false

  for (const char of text) {
    const isWhitespace = /\s/.test(char)
    if (inWord && isWhitespace) {
      if (current) tokens.push(current)
      current = char
      inWord = false
    } else if (!inWord && !isWhitespace) {
      if (current) tokens.push(current)
      current = char
      inWord = true
    } else {
      current += char
    }
  }

  if (current) tokens.push(current)
  return tokens
}

/**
 * Compute the longest common subsequence table
 */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (): number[] => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp
}

/**
 * Backtrack through LCS table to produce diff
 */
function backtrack(dp: number[][], a: string[], b: string[], i: number, j: number): DiffSegment[] {
  const result: DiffSegment[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'equal', value: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'insert', value: b[j - 1] })
      j--
    } else if (i > 0) {
      result.unshift({ type: 'delete', value: a[i - 1] })
      i--
    }
  }

  return result
}

/**
 * Merge consecutive segments of the same type
 */
function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
  if (segments.length === 0) return []

  const merged: DiffSegment[] = []
  let current = { ...segments[0] }

  for (let i = 1; i < segments.length; i++) {
    if (segments[i].type === current.type) {
      current.value += segments[i].value
    } else {
      merged.push(current)
      current = { ...segments[i] }
    }
  }

  merged.push(current)
  return merged
}

/**
 * Computes a word-level diff between two strings
 * @param oldText The original text
 * @param newText The modified text
 * @returns Array of diff segments
 */
export function computeWordDiff(oldText: string, newText: string): DiffSegment[] {
  // Handle edge cases
  if (oldText === newText) {
    return oldText ? [{ type: 'equal', value: oldText }] : []
  }

  if (!oldText) {
    return newText ? [{ type: 'insert', value: newText }] : []
  }

  if (!newText) {
    return [{ type: 'delete', value: oldText }]
  }

  // Tokenize both texts
  const oldTokens = tokenize(oldText)
  const newTokens = tokenize(newText)

  // Compute LCS and diff
  const dp = lcsTable(oldTokens, newTokens)
  const segments = backtrack(dp, oldTokens, newTokens, oldTokens.length, newTokens.length)

  // Merge consecutive segments of the same type
  return mergeSegments(segments)
}

/**
 * Computes diff for paragraph-level content
 * Splits by paragraphs first, then does word-level diff within each
 */
export function computeParagraphAwareDiff(oldText: string, newText: string): DiffSegment[] {
  // For now, just use word-level diff
  // Future enhancement: split by paragraphs and diff each separately
  return computeWordDiff(oldText, newText)
}
