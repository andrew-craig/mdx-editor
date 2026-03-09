import React from 'react'
import { MDXEditor, MDXEditorMethods, headingsPlugin, listsPlugin, quotePlugin } from '../'
import { trackChangesPlugin } from '../plugins/trackchanges'
import { useRef, useState } from 'react'

const currentMarkdown = `# Hello, World!

This is the current version of the document. It has been updated with new content.

Here is a new paragraph that was added.

- Item one
- Item two (modified)
- Item three`

const baselineMarkdown = `# Hello, World!

This is the original version of the document.

- Item one
- Item two
- A deleted item`

export function BasicTrackChanges() {
  const ref = useRef<MDXEditorMethods>(null)
  return (
    <div className="App">
      <MDXEditor
        ref={ref}
        markdown={currentMarkdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          trackChangesPlugin({
            baselineMarkdown: baselineMarkdown,
            enabled: true
          })
        ]}
      />
      <button
        onClick={() => {
          console.log(ref.current?.getMarkdown())
        }}
      >
        Get Markdown
      </button>
    </div>
  )
}

export function ToggleableTrackChanges() {
  const ref = useRef<MDXEditorMethods>(null)
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="App">
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => {
            setEnabled(!enabled)
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: enabled ? '#22c55e' : '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {enabled ? 'Track Changes: ON' : 'Track Changes: OFF'}
        </button>
      </div>
      <MDXEditor
        ref={ref}
        markdown={currentMarkdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          trackChangesPlugin({
            baselineMarkdown: baselineMarkdown,
            enabled: enabled
          })
        ]}
      />
    </div>
  )
}

const longCurrentMarkdown = `# Project Documentation

## Introduction

This document describes the architecture of our application. The system has been redesigned to use a modern microservices approach.

## Features

The application now includes the following features:

- User authentication with OAuth 2.0
- Real-time notifications
- Enhanced search functionality
- Data export capabilities

## Architecture

The system consists of several interconnected services that communicate via REST APIs and message queues.

### Backend Services

The backend is built with Node.js and uses PostgreSQL for data storage.

### Frontend

The frontend is a React application with TypeScript.`

const longBaselineMarkdown = `# Project Documentation

## Introduction

This document describes the architecture of our application.

## Features

The application includes the following features:

- User authentication
- Basic notifications
- Search functionality

## Architecture

The system consists of several interconnected services.

### Backend Services

The backend is built with Node.js and uses MySQL for data storage.

### Frontend

The frontend is a React application.

## Conclusion

This section has been removed.`

export function LongDocumentTrackChanges() {
  const ref = useRef<MDXEditorMethods>(null)

  return (
    <div className="App">
      <h3 style={{ marginBottom: '1rem' }}>Long Document with Track Changes</h3>
      <MDXEditor
        ref={ref}
        markdown={longCurrentMarkdown}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          trackChangesPlugin({
            baselineMarkdown: longBaselineMarkdown,
            enabled: true
          })
        ]}
      />
    </div>
  )
}

export function EditableWithTrackChangesToggle() {
  const ref = useRef<MDXEditorMethods>(null)
  const [enabled, setEnabled] = useState(false)
  const [markdown, setMarkdown] = useState(currentMarkdown)

  return (
    <div className="App">
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => {
            setEnabled(!enabled)
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: enabled ? '#22c55e' : '#e5e7eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {enabled ? 'View Changes' : 'Edit Mode'}
        </button>
        <span style={{ alignSelf: 'center', color: '#666' }}>
          {enabled ? '(Read-only: viewing changes from baseline)' : '(Editable: make changes to see diff)'}
        </span>
      </div>
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={(md) => {
          setMarkdown(md)
        }}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          trackChangesPlugin({
            baselineMarkdown: baselineMarkdown,
            enabled: enabled
          })
        ]}
      />
    </div>
  )
}
