import React from 'react'
import { useCellValues } from '@mdxeditor/gurx'
import { trackChangesEnabled$ } from './cells'
import { TrackChangesViewer } from './TrackChangesViewer'

/**
 * Wrapper component that switches between normal editor and track changes view.
 * When track changes is enabled, shows the diff view instead of the normal editor.
 */
export const TrackChangesWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled] = useCellValues(trackChangesEnabled$)

  return (
    <div className="mdxeditor-track-changes-wrapper">
      {/* Normal editor - hidden when track changes is enabled */}
      <div style={{ display: enabled ? 'none' : 'block' }}>{children}</div>

      {/* Track changes view - shown when enabled */}
      {enabled && <TrackChangesViewer />}
    </div>
  )
}
