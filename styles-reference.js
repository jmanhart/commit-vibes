/**
 * Commit Vibes - Styles Reference
 * 
 * Export this file to use in your Astro/web project for matching
 * the exact look and feel of commit-vibes terminal output.
 */

export const commitVibesStyles = {
  // Chalk color hex values (for CSS/web)
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
      dim: 'rgba(255, 255, 255, 0.5)',
    },
    // Clack prompt colors
    clack: {
      primary: '#10b981',      // Green - selected items
      secondary: '#6b7280',   // Gray - hints
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',         // Blue - spinner, info
      text: '#ffffff',
      textDim: '#9ca3af',
      textMuted: '#6b7280',
      spinner: '#3b82f6',
      pointer: '#10b981',
    },
    // Terminal colors
    terminal: {
      bg: '#1e1e1e',
      fg: '#d4d4d4',
      cursor: '#d4d4d4',
      selection: '#264f78',
    },
  },

  // Typography
  typography: {
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: 1.5,
    fontWeight: {
      normal: 400,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    promptMargin: '1em 0',
    optionIndent: '1em',
    fileIndent: '1em',
  },

  // xterm.js theme configuration
  xtermTheme: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    cursor: '#d4d4d4',
    selection: '#264f78',
    black: '#000000',
    red: '#d70000',
    green: '#00d700',
    yellow: '#d7d700',
    blue: '#005fd7',
    magenta: '#d700d7',
    cyan: '#00d7d7',
    white: '#ffffff',
    brightBlack: '#808080',
    brightRed: '#ff5f5f',
    brightGreen: '#5fff5f',
    brightYellow: '#ffff5f',
    brightBlue: '#5fafff',
    brightMagenta: '#ff5fff',
    brightCyan: '#5fffff',
    brightWhite: '#ffffff',
  },

  // Visual symbols and characters
  symbols: {
    prompt: '\u25C7',        // ◇
    verticalLine: '\u2502',  // │
    pointer: '\u003E',       // >
    checkmark: '\u2713',     // ✓
    cross: '\u2717',        // ✗
    checkedBox: '\u2611',     // ☑
    uncheckedBox: '\u2610',  // ☐
    bottomLeft: '\u2514',    // └
    topLeft: '\u250C',       // ┌
    horizontal: '\u2500',    // ─
  },

  // Spinner animation frames (rotate through these)
  spinnerFrames: [
    '\u28FE', // ⣾
    '\u28FD', // ⣽
    '\u28FB', // ⣻
    '\u28BF', // ⢿
    '\u28BF', // ⡿
    '\u28DF', // ⣟
    '\u28EF', // ⣯
    '\u28F7', // ⣷
  ],

  // Layout spacing
  layout: {
    symbolSpacing: 1,        // Space after ◇
    lineSpacing: 1,          // Space after │
    pointerSpacing: 1,       // Space after >
    checkboxSpacing: 1,      // Space after checkbox
    optionIndent: 2,         // Total indent for options (│ + space)
  },

  // xterm.js options
  xtermOptions: {
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: 14,
    lineHeight: 1.5,
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#d4d4d4',
      selection: '#264f78',
      black: '#000000',
      red: '#d70000',
      green: '#00d700',
      yellow: '#d7d700',
      blue: '#005fd7',
      magenta: '#d700d7',
      cyan: '#00d7d7',
      white: '#ffffff',
      brightBlack: '#808080',
      brightRed: '#ff5f5f',
      brightGreen: '#5fff5f',
      brightYellow: '#ffff5f',
      brightBlue: '#5fafff',
      brightMagenta: '#ff5fff',
      brightCyan: '#5fffff',
      brightWhite: '#ffffff',
    },
  },
};

// CSS string for direct use
export const commitVibesCSS = `
/* Terminal Container */
.terminal {
  font-family: ${commitVibesStyles.typography.fontFamily};
  font-size: ${commitVibesStyles.typography.fontSize};
  line-height: ${commitVibesStyles.typography.lineHeight};
  background: ${commitVibesStyles.colors.terminal.bg};
  color: ${commitVibesStyles.colors.terminal.fg};
  padding: 20px;
  border-radius: 8px;
}

/* Chalk Colors */
.chalk-blue { color: ${commitVibesStyles.colors.chalk.blue}; }
.chalk-green { color: ${commitVibesStyles.colors.chalk.green}; }
.chalk-red { color: ${commitVibesStyles.colors.chalk.red}; }
.chalk-yellow { color: ${commitVibesStyles.colors.chalk.yellow}; }
.chalk-cyan { color: ${commitVibesStyles.colors.chalk.cyan}; }
.chalk-gray { color: ${commitVibesStyles.colors.chalk.gray}; }
.chalk-white { color: ${commitVibesStyles.colors.chalk.white}; }
.chalk-magenta { color: ${commitVibesStyles.colors.chalk.magenta}; }
.chalk-dim { opacity: 0.5; }
.chalk-bold { font-weight: bold; }

/* Clack Prompt Styles */
.clack-prompt {
  margin: ${commitVibesStyles.spacing.promptMargin};
}

.clack-symbol {
  color: ${commitVibesStyles.colors.clack.info};
}

.clack-message {
  color: ${commitVibesStyles.colors.clack.text};
  margin-left: 0.5em;
}

.clack-option {
  color: ${commitVibesStyles.colors.clack.textDim};
  margin-left: ${commitVibesStyles.spacing.optionIndent};
}

.clack-option-selected {
  color: ${commitVibesStyles.colors.clack.primary};
}

.clack-option-checked::before {
  content: '☑ ';
  color: ${commitVibesStyles.colors.clack.primary};
}

.clack-option-unchecked::before {
  content: '☐ ';
  color: ${commitVibesStyles.colors.clack.textDim};
}

/* File Lists */
.files-header {
  color: ${commitVibesStyles.colors.chalk.green};
}

.file-item {
  color: ${commitVibesStyles.colors.chalk.gray};
  margin-left: ${commitVibesStyles.spacing.fileIndent};
}

/* Spotify Info */
.spotify-header {
  color: ${commitVibesStyles.colors.chalk.blue};
}

.track-info {
  color: ${commitVibesStyles.colors.chalk.gray};
  margin-left: ${commitVibesStyles.spacing.fileIndent};
}

/* Commit Message */
.commit-header {
  color: ${commitVibesStyles.colors.chalk.cyan};
}

.commit-text {
  color: ${commitVibesStyles.colors.chalk.white};
}

/* Status Messages */
.success {
  color: ${commitVibesStyles.colors.chalk.green};
}

.error {
  color: ${commitVibesStyles.colors.chalk.red};
}

.warning {
  color: ${commitVibesStyles.colors.chalk.yellow};
}
`;

// Helper functions to build Clack-style prompts

/**
 * Build a select prompt string
 */
export function buildSelectPrompt(message, options, selectedIndex = 0) {
  const { prompt, verticalLine, pointer } = commitVibesStyles.symbols;
  const { symbolSpacing, lineSpacing, pointerSpacing, optionIndent } = commitVibesStyles.layout;
  const { info, primary, textDim } = commitVibesStyles.colors.clack;
  
  let output = `${prompt}${' '.repeat(symbolSpacing)}${message}\n`;
  
  options.forEach((option, index) => {
    const isSelected = index === selectedIndex;
    const pointerChar = isSelected ? pointer : ' ';
    const color = isSelected ? primary : textDim;
    const reset = '\x1b[0m';
    const colorCode = isSelected ? '\x1b[32m' : '\x1b[90m';
    
    output += `${verticalLine}${' '.repeat(lineSpacing)}${pointerChar}${' '.repeat(pointerSpacing)}${colorCode}${option}${reset}\n`;
  });
  
  return output;
}

/**
 * Build a multiselect prompt string
 */
export function buildMultiselectPrompt(message, options, selectedIndices = []) {
  const { prompt, verticalLine, pointer, checkedBox, uncheckedBox } = commitVibesStyles.symbols;
  const { symbolSpacing, lineSpacing, pointerSpacing, checkboxSpacing } = commitVibesStyles.layout;
  const { primary, textDim } = commitVibesStyles.colors.clack;
  
  let output = `${prompt}${' '.repeat(symbolSpacing)}${message}\n`;
  
  options.forEach((option, index) => {
    const isChecked = selectedIndices.includes(index);
    const checkbox = isChecked ? checkedBox : uncheckedBox;
    const colorCode = isChecked ? '\x1b[32m' : '\x1b[90m';
    const reset = '\x1b[0m';
    
    output += `${verticalLine}${' '.repeat(lineSpacing)}${pointer}${' '.repeat(pointerSpacing)}${colorCode}${checkbox}${' '.repeat(checkboxSpacing)}${option}${reset}\n`;
  });
  
  return output;
}

/**
 * Build a text input prompt string
 */
export function buildTextPrompt(message, input = '', showCursor = true) {
  const { prompt, verticalLine, pointer } = commitVibesStyles.symbols;
  const { symbolSpacing, lineSpacing, pointerSpacing } = commitVibesStyles.layout;
  const cursor = showCursor ? '█' : '';
  
  let output = `${prompt}${' '.repeat(symbolSpacing)}${message}\n`;
  output += `${verticalLine}${' '.repeat(lineSpacing)}${pointer}${' '.repeat(pointerSpacing)}${input}${cursor}\n`;
  
  return output;
}

/**
 * Build an intro message
 */
export function buildIntro(message) {
  const { topLeft } = commitVibesStyles.symbols;
  const { info } = commitVibesStyles.colors.clack;
  
  return `\x1b[34m${topLeft}\x1b[0m  \x1b[34m\x1b[1m${message}\x1b[0m\n`;
}

/**
 * Build an outro message
 */
export function buildOutro(message) {
  const { bottomLeft, checkmark } = commitVibesStyles.symbols;
  const { primary } = commitVibesStyles.colors.clack;
  
  return `\x1b[32m${bottomLeft}\x1b[0m  \x1b[32m${checkmark} ${message}\x1b[0m\n`;
}

/**
 * Get spinner frame for animation
 */
export function getSpinnerFrame(frameIndex = 0) {
  const frames = commitVibesStyles.spinnerFrames;
  return frames[frameIndex % frames.length];
}

// Helper function to get xterm.js terminal instance with correct styling
export function createStyledTerminal() {
  if (typeof window === 'undefined') {
    throw new Error('This function must be called in a browser environment');
  }
  
  // Dynamic import for xterm.js (if needed)
  return {
    options: commitVibesStyles.xtermOptions,
    theme: commitVibesStyles.xtermTheme,
  };
}
