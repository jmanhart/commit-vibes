# Clack Prompts - Visual Elements Reference

This file documents all the visual characters, symbols, and layout patterns used by Clack prompts to recreate them exactly in a web terminal.

## Core Visual Symbols

### Prompt Symbols
- **◇** (U+25C7) - Main prompt symbol (diamond/lozenge)
- **│** (U+2502) - Vertical line for option lists
- **>** (U+003E) - Selection pointer (greater than)
- **✓** (U+2713) - Checkmark (success/checked)
- **✗** (U+2717) - Cross/X mark (error/unchecked)

### Spinner Characters (Animated)
Clack uses these characters that rotate to create a spinner animation:
```
⣾ ⣽ ⣻ ⢿ ⡿ ⣟ ⣯ ⣷
```

These are Braille pattern characters that create a smooth rotating effect.

### Checkbox Symbols
- **☑** (U+2611) - Checked checkbox (ballot box with check)
- **☐** (U+2610) - Unchecked checkbox (ballot box)

### Other Symbols
- **└** (U+2514) - Bottom-left corner (used in outro)
- **─** (U+2500) - Horizontal line

## Prompt Layout Structure

### Select Prompt
```
◇  Message text here?
│  > Option 1 (selected - green)
│    Option 2 (unselected - gray)
│    Option 3 (unselected - gray)
```

**Structure:**
- Line 1: `◇` (blue) + space + message text (white)
- Line 2+: `│` (gray) + space + `>` (green if selected) + space + option text
- Selected option: green color
- Unselected options: gray color

### Multiselect Prompt
```
◇  Select files to stage:
│  > ☑ file1.js (checked - green)
│    ☐ file2.js (unchecked - gray)
│    ☑ file3.js (checked - green)
```

**Structure:**
- Line 1: `◇` (blue) + space + message text (white)
- Line 2+: `│` (gray) + space + `>` (green) + space + checkbox + space + option text
- Checked: `☑` (green)
- Unchecked: `☐` (gray)

### Text Input Prompt
```
◇  What's your commit message?
│  > user types here...
```

**Structure:**
- Line 1: `◇` (blue) + space + message text (white)
- Line 2: `│` (gray) + space + `>` (blue) + space + input text (white)
- Cursor blinks after input text

### Confirm Prompt
```
◇  Add this song to your commit message?
│  > Yes (selected - green)
│    No (unselected - gray)
```

**Structure:**
- Same as Select prompt
- Typically Yes/No options

### Intro (Welcome Screen)
```
┌  Welcome to Commit Vibes!
```

**Structure:**
- `┌` (blue) + space + message text (blue, bold)
- Often includes spinner animation before text appears

### Outro (Success Screen)
```
└  ✅ Commit created successfully!
```

**Structure:**
- `└` (green) + space + checkmark + space + message text (green)

## Character Codes for Web Use

### Unicode Characters
```javascript
export const clackSymbols = {
  prompt: '\u25C7',      // ◇
  verticalLine: '\u2502', // │
  pointer: '\u003E',     // >
  checkmark: '\u2713',   // ✓
  cross: '\u2717',       // ✗
  checkedBox: '\u2611',  // ☑
  uncheckedBox: '\u2610', // ☐
  bottomLeft: '\u2514',  // └
  topLeft: '\u250C',     // ┌
  horizontal: '\u2500',  // ─
};

// Spinner frames (rotate through these)
export const spinnerFrames = [
  '\u28FE', // ⣾
  '\u28FD', // ⣽
  '\u28FB', // ⣻
  '\u28BF', // ⢿
  '\u28BF', // ⡿
  '\u28DF', // ⣟
  '\u28EF', // ⣯
  '\u28F7', // ⣷
];
```

### HTML Entities
```html
◇ = &diams; or &#9671;
│ = &#9474;
> = &gt; or just >
✓ = &check; or &#10003;
✗ = &cross; or &#10007;
☑ = &#9745;
☐ = &#9744;
└ = &#9492;
┌ = &#9484;
```

## Layout Spacing

### Horizontal Spacing
- After `◇`: 1 space
- After `│`: 1 space
- After `>`: 1 space
- Between checkbox and text: 1 space

### Vertical Spacing
- Between prompt and options: 0 lines (options start immediately)
- Between options: 0 lines (options are consecutive)
- After prompt: 1 blank line

## Color Application

### Symbol Colors
- `◇`: Blue (#3b82f6)
- `│`: Gray (#6b7280 or dimmed)
- `>`: Green (#10b981) when selected, Blue (#3b82f6) for input
- `☑`: Green (#10b981)
- `☐`: Gray (#6b7280)
- `┌`: Blue (#3b82f6)
- `└`: Green (#10b981)

### Text Colors
- Message text: White (#ffffff)
- Selected option: Green (#10b981)
- Unselected option: Gray (#9ca3af)
- Input text: White (#ffffff)
- Hints: Gray (#6b7280), dimmed

## Animation Details

### Spinner Animation
- Rotates through 8 frames
- Updates approximately every 80-100ms
- Blue color (#3b82f6)
- Appears before prompt message during loading

### Cursor Blink
- Text input cursor blinks
- On/off cycle: ~500ms each
- Color: matches foreground text color

## Complete Layout Examples

### Full Select Prompt
```
◇  How are you feeling about this commit?
│  > 🎉 Victory
│    😤 Frustrated
│    🤔 Questionable Commit
│    🔥 Big Energy
│    💀 It Works... Somehow
```

### Full Multiselect Prompt
```
◇  Select files to stage (space to select, enter to confirm):
│  > ☑ 📦 Stage All Files (3 files)
│    ☐ src/file1.js
│    ☑ src/file2.js
│    ☐ src/file3.js
```

### Full Text Input Prompt
```
◇  What's your commit message?
│  > fix: resolve login bug█
```
(█ represents blinking cursor)

### Intro + Prompt Flow
```
┌  Welcome to Commit Vibes!

◇  What's your commit message?
│  > fix: bug
```

### Complete Flow with Outro
```
┌  Welcome to Commit Vibes!

◇  How are you feeling about this commit?
│  > 🎉 Victory

📝 Final commit message:
fix: bug 🎉 Victory

└  ✅ Commit created successfully!
```

## CSS/HTML Implementation Guide

### Creating the Prompt Symbol
```css
.clack-prompt-symbol::before {
  content: '\25C7'; /* ◇ */
  color: #3b82f6; /* Blue */
  margin-right: 0.5em;
}
```

### Creating the Vertical Line
```css
.clack-option-line::before {
  content: '\2502'; /* │ */
  color: #6b7280; /* Gray */
  margin-right: 0.5em;
}
```

### Creating the Pointer
```css
.clack-pointer::before {
  content: '>';
  color: #10b981; /* Green when selected */
  margin-right: 0.5em;
}
```

### Creating Checkboxes
```css
.clack-checkbox-checked::before {
  content: '\2611'; /* ☑ */
  color: #10b981;
  margin-right: 0.5em;
}

.clack-checkbox-unchecked::before {
  content: '\2610'; /* ☐ */
  color: #6b7280;
  margin-right: 0.5em;
}
```

### Spinner Animation
```css
@keyframes spinner {
  0% { content: '\28FE'; } /* ⣾ */
  12.5% { content: '\28FD'; } /* ⣽ */
  25% { content: '\28FB'; } /* ⣻ */
  37.5% { content: '\28BF'; } /* ⢿ */
  50% { content: '\28BF'; } /* ⡿ */
  62.5% { content: '\28DF'; } /* ⣟ */
  75% { content: '\28EF'; } /* ⣯ */
  87.5% { content: '\28F7'; } /* ⣷ */
  100% { content: '\28FE'; } /* ⣾ */
}

.clack-spinner::before {
  animation: spinner 0.8s linear infinite;
  color: #3b82f6;
}
```

## JavaScript Implementation

### Building a Select Prompt
```javascript
function renderSelectPrompt(message, options, selectedIndex) {
  let output = `\u25C7  ${message}\n`;
  
  options.forEach((option, index) => {
    const isSelected = index === selectedIndex;
    const pointer = isSelected ? '>' : ' ';
    const color = isSelected ? '\x1b[32m' : '\x1b[90m'; // Green or gray
    const reset = '\x1b[0m';
    
    output += `\u2502  ${pointer} ${color}${option}${reset}\n`;
  });
  
  return output;
}
```

### Building a Multiselect Prompt
```javascript
function renderMultiselectPrompt(message, options, selectedIndices) {
  let output = `\u25C7  ${message}\n`;
  
  options.forEach((option, index) => {
    const isChecked = selectedIndices.includes(index);
    const checkbox = isChecked ? '\u2611' : '\u2610';
    const color = isChecked ? '\x1b[32m' : '\x1b[90m';
    const reset = '\x1b[0m';
    
    output += `\u2502  > ${color}${checkbox} ${option}${reset}\n`;
  });
  
  return output;
}
```

## xterm.js Implementation

For xterm.js, you'll write these characters directly:

```javascript
// Write prompt symbol
term.writeln('\x1b[34m◇\x1b[0m  How are you feeling about this commit?');

// Write options
term.writeln('\x1b[90m│\x1b[0m  \x1b[32m>\x1b[0m \x1b[32m🎉 Victory\x1b[0m');
term.writeln('\x1b[90m│\x1b[0m    \x1b[90m😤 Frustrated\x1b[0m');
```

## Key Takeaways

1. **All prompts start with ◇** (blue diamond)
2. **Options use │** (gray vertical line) as prefix
3. **Selected items have >** (green pointer)
4. **Multiselect uses ☑/☐** (green/gray checkboxes)
5. **Spacing is critical** - 1 space between elements
6. **Colors match the Clack theme** - blue for symbols, green for selected, gray for unselected
7. **Monospace font required** - all characters must align properly
