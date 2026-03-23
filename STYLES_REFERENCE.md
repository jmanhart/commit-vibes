# Commit Vibes - Styles Reference for Web Terminal Demo

This file contains all the colors, typography, and styling used in commit-vibes for creating a 1:1 matching web terminal demo.

## Chalk Colors Used

### Primary Colors
- **Blue**: Used for headers, Spotify info, intro messages
- **Green**: Success messages, staged files, completion
- **Red**: Errors, cancellations, warnings
- **Yellow**: Warnings, tips, info messages
- **Cyan**: Section headers, file info, commit messages
- **Gray/Dim**: Secondary text, hints, file lists
- **White**: Main text, commit messages
- **Magenta**: Header accents
- **Bold**: Emphasis on headers and important text

### ANSI Color Codes (for terminal)
```javascript
// Chalk color mappings to ANSI codes
const chalkColors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  dim: '\x1b[2m',
  white: '\x1b[37m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};
```

### Hex Color Equivalents (for web/CSS)
```css
/* Standard terminal colors (16-color palette) */
:root {
  /* Chalk colors */
  --chalk-blue: #005fd7;        /* ANSI blue */
  --chalk-green: #00d700;        /* ANSI green */
  --chalk-red: #d70000;          /* ANSI red */
  --chalk-yellow: #d7d700;       /* ANSI yellow */
  --chalk-cyan: #00d7d7;         /* ANSI cyan */
  --chalk-gray: #808080;         /* ANSI gray/bright black */
  --chalk-white: #ffffff;        /* ANSI white */
  --chalk-magenta: #d700d7;      /* ANSI magenta */
  
  /* Dimmed versions */
  --chalk-dim: rgba(255, 255, 255, 0.5);
  
  /* Background */
  --terminal-bg: #1e1e1e;        /* Dark terminal background */
  --terminal-fg: #d4d4d4;        /* Default text color */
}
```

## Clack Prompts Styling

### Default Clack Theme Colors
Clack uses a specific color scheme for its interactive prompts. Here are the key colors:

```javascript
// Clack default theme (from @clack/prompts)
const clackTheme = {
  // Primary colors
  primary: '#10b981',      // Green - selected items, success
  secondary: '#6b7280',   // Gray - hints, secondary text
  success: '#10b981',      // Green - success states
  error: '#ef4444',        // Red - errors
  warning: '#f59e0b',      // Yellow/Orange - warnings
  info: '#3b82f6',         // Blue - info messages
  
  // UI elements
  spinner: '#3b82f6',      // Blue spinner
  pointer: '>',            // Selection pointer
  pointerColor: '#10b981', // Green pointer
  
  // Text colors
  text: '#ffffff',         // Main text
  textDim: '#9ca3af',      // Dimmed text
  textMuted: '#6b7280',    // Muted text
  
  // Background
  bg: '#1e1e1e',           // Terminal background
  bgSubtle: '#2a2a2a',     // Subtle background variations
};
```

### Clack Prompt Types
- **Select**: Blue spinner, green selected item, gray options
- **Multiselect**: Blue spinner, green checked items, gray unchecked
- **Text**: Blue spinner, white input text
- **Confirm**: Blue spinner, green/red yes/no options
- **Intro**: Blue bold text with spinner
- **Outro**: Green success message

## Typography

### Font
- **Family**: Monospace (terminal font)
  - macOS: `Menlo`, `Monaco`, `Courier New`
  - Linux: `DejaVu Sans Mono`, `Liberation Mono`
  - Windows: `Consolas`, `Courier New`
  - Fallback: `monospace`
  
- **Size**: Typically 14px-16px for terminal
- **Line Height**: 1.4-1.6
- **Weight**: Normal (400) for most text, Bold (700) for headers

## Specific UI Elements

### Headers
```css
/* Intro header */
.intro {
  color: var(--chalk-blue);
  font-weight: bold;
  font-size: 1.2em;
}
```

### File Lists
```css
/* Staged files header */
.files-header {
  color: var(--chalk-green);
}

/* File list items */
.file-item {
  color: var(--chalk-gray);
  margin-left: 1em;
}
```

### Spotify Info
```css
/* Spotify section header */
.spotify-header {
  color: var(--chalk-blue);
}

/* Track info */
.track-info {
  color: var(--chalk-gray);
  margin-left: 1em;
}
```

### Commit Message
```css
/* Commit message header */
.commit-header {
  color: var(--chalk-cyan);
}

/* Commit message text */
.commit-text {
  color: var(--chalk-white);
}
```

### Success/Error Messages
```css
/* Success */
.success {
  color: var(--chalk-green);
}

/* Error */
.error {
  color: var(--chalk-red);
}

/* Warning */
.warning {
  color: var(--chalk-yellow);
}
```

## Clack Prompt Visual Structure

### Select Prompt
```
◇  How are you feeling about this commit?
│  > 🎉 Victory                    ← Selected (green)
│    😤 Frustrated                 ← Unselected (gray)
│    🤔 Questionable Commit         ← Unselected (gray)
```

### Multiselect Prompt
```
◇  Select files to stage:
│  > ☑ src/file1.js                ← Checked (green)
│    ☐ src/file2.js                ← Unchecked (gray)
│    ☑ src/file3.js                ← Checked (green)
```

### Text Prompt
```
◇  What's your commit message?
│  > fix: bug in login             ← User input (white)
```

### Confirm Prompt
```
◇  Add this song to your commit message?
│  > Yes                           ← Selected (green)
│    No                            ← Unselected (gray)
```

## Emojis Used
- 🎵 - Spotify/music
- 📂 - Files/folders
- ✅ - Success/checkmark
- ❌ - Error/cancel
- ⚠️ - Warning
- 💡 - Tip/info
- 🎉 - Victory/celebration
- 📝 - Writing/document
- 📦 - Package/files
- 🔥 - Energy/excitement
- And all the vibe emojis from vibes.js

## Complete CSS for Web Terminal

```css
/* Terminal Container */
.terminal {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
}

/* Clack Prompt Styles */
.clack-prompt {
  margin: 1em 0;
}

.clack-symbol {
  color: #3b82f6; /* Blue spinner/symbol */
}

.clack-message {
  color: #ffffff;
  margin-left: 0.5em;
}

.clack-option {
  color: #9ca3af; /* Gray unselected */
  margin-left: 1em;
}

.clack-option-selected {
  color: #10b981; /* Green selected */
}

.clack-option-checked::before {
  content: '☑ ';
  color: #10b981;
}

.clack-option-unchecked::before {
  content: '☐ ';
  color: #9ca3af;
}

/* Chalk color classes */
.chalk-blue { color: #005fd7; }
.chalk-green { color: #00d700; }
.chalk-red { color: #d70000; }
.chalk-yellow { color: #d7d700; }
.chalk-cyan { color: #00d7d7; }
.chalk-gray { color: #808080; }
.chalk-white { color: #ffffff; }
.chalk-magenta { color: #d700d7; }
.chalk-dim { opacity: 0.5; }
.chalk-bold { font-weight: bold; }
```

## JavaScript/TypeScript Constants

```javascript
// For use in Astro/React/Vue components
export const COMMIT_VIBES_STYLES = {
  colors: {
    chalk: {
      blue: '#005fd7',
      green: '#00d700',
      red: '#d70000',
      yellow: '#d7d700',
      cyan: '#00d7d7',
      gray: '#808080',
      white: '#ffffff',
      magenta: '#d700d7',
    },
    clack: {
      primary: '#10b981',
      secondary: '#6b7280',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      text: '#ffffff',
      textDim: '#9ca3af',
      textMuted: '#6b7280',
    },
    terminal: {
      bg: '#1e1e1e',
      fg: '#d4d4d4',
    },
  },
  typography: {
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: 1.5,
  },
  spacing: {
    promptMargin: '1em 0',
    optionIndent: '1em',
  },
};
```

## Usage in xterm.js

For xterm.js terminal, use these theme options:

```javascript
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const terminal = new Terminal({
  theme: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    cursor: '#d4d4d4',
    selection: '#264f78',
    black: '#000000',
    red: '#d70000',      // chalk.red
    green: '#00d700',    // chalk.green
    yellow: '#d7d700',   // chalk.yellow
    blue: '#005fd7',     // chalk.blue
    magenta: '#d700d7',  // chalk.magenta
    cyan: '#00d7d7',     // chalk.cyan
    white: '#ffffff',    // chalk.white
    brightBlack: '#808080',  // chalk.gray
    brightRed: '#ff5f5f',
    brightGreen: '#5fff5f',
    brightYellow: '#ffff5f',
    brightBlue: '#5fafff',
    brightMagenta: '#ff5fff',
    brightCyan: '#5fffff',
    brightWhite: '#ffffff',
  },
  fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
  fontSize: 14,
  lineHeight: 1.5,
});
```

## Notes

- Clack uses animated spinners (⣾ ⣽ ⣻ ⢿ ⡿ ⣟ ⣯ ⣷) that rotate
- Selection pointer is `>` character in green
- Checkboxes use ☑ (checked) and ☐ (unchecked) emojis
- All prompts use the ◇ symbol on the left
- Vertical lines │ are used to show option lists
- Intro uses a spinner animation before the message
- Outro shows a success checkmark ✓
