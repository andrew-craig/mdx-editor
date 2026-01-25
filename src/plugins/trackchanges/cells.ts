import { Cell } from '@mdxeditor/gurx'

/**
 * Holds the baseline markdown to compare against.
 * @group Track Changes
 */
export const trackChangesBaseline$ = Cell<string>('')

/**
 * Holds whether track changes mode is enabled.
 * @group Track Changes
 */
export const trackChangesEnabled$ = Cell<boolean>(false)
