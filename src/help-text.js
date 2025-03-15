import chalk from "chalk";
import { VIBES } from "./vibes.js";

export const HEADER = `\n${chalk.blue("🎵")} ${chalk.cyan(
  "Commit"
)} ${chalk.magenta("Vibes")} ${chalk.green("-")} ${chalk.yellow(
  "Make"
)} ${chalk.red("Your")} ${chalk.blue("Commits")} ${chalk.magenta(
  "Fun!"
)} ${chalk.blue("🎵")}\n`;

export const sections = {
  examples: `
Examples:
  $ commit-vibes                    # Interactive mode
  $ commit-vibes "fix: bug fix"     # Direct commit with message
  $ commit-vibes --list-vibes       # Show all available vibes
  `,
  defaultVibes: `
Default Vibes Categories:
  🎉 Celebration     - For celebrating achievements
  🐛 Bug Fix         - For bug fixes
  ✨ Feature         - For new features
  🔧 Maintenance     - For maintenance tasks
  📚 Documentation   - For documentation updates
  `,
  customVibes: `
Custom Vibes:
  You can create your own vibes by creating a JSON file with your custom emojis
  and descriptions. Then use the --custom-vibe option to load them:
  
  Example custom-vibes.json:
  {
    "vibes": [
      { "emoji": "🚀", "description": "Performance improvements" },
      { "emoji": "🎨", "description": "UI/UX changes" }
    ]
  }

  $ commit-vibes -c ./custom-vibes.json
  `,
  links: `
For more information and updates, visit:
  https://github.com/yourusername/commit-vibes
  `,
};

export const HELP_CONTENT = Object.values(sections).join("\n");
