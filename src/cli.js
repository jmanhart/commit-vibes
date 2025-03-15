#!/usr/bin/env node

import { intro } from "@clack/prompts";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { Command } from "commander";
import {
  getStagedFiles,
  stageAllChanges,
  stageSelectedFiles,
  commitChanges,
} from "./git-utils.js";
import {
  promptForStagingChoice,
  promptForFileSelection,
  promptForMoodSelection,
  promptCommitMessage,
  showSuccessMessage,
} from "./prompts.js";
import { HEADER, HELP_CONTENT } from "./help-text.js";
import { VIBES } from "./vibes.js";

// Create program instance
const program = new Command();

// Setup program information
program
  .name("commit-vibes")
  .description("A fun and interactive way to create git commits with vibes! 🎵")
  .version("1.0.0")
  .argument("[message]", "commit message (optional)")
  .option("-l, --list-vibes", "list all available vibes")
  .option("-c, --custom-vibe <path>", "path to custom vibes configuration file")
  .addHelpText("beforeAll", HEADER)
  .addHelpText("after", HELP_CONTENT);

export async function runCLI() {
  // Parse command line arguments
  program.parse();
  const options = program.opts();
  const args = program.args;

  // Handle --list-vibes option
  if (options.listVibes) {
    console.log(chalk.blue.bold("\nAvailable Vibes:"));
    VIBES.forEach(({ value, hint }) => {
      console.log(chalk.gray(`  ${value}`));
      console.log(chalk.dim(`    ${hint}`));
    });
    console.log(); // Add empty line at end
    process.exit(0);
  }

  console.clear();
  intro(chalk.blue.bold("Welcome to Commit Vibes!"));

  // Check for staged files
  let stagedFiles = getStagedFiles();

  // If no staged files, prompt user
  if (!stagedFiles.length) {
    const stageChoice = await promptForStagingChoice();

    if (stageChoice === "yes") {
      stageAllChanges();
      stagedFiles = getStagedFiles();
    } else if (stageChoice === "select") {
      const selectedFiles = await promptForFileSelection();
      stageSelectedFiles(selectedFiles);
      stagedFiles = getStagedFiles();
    } else {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }
  }

  console.log(chalk.green("\n📂 Staged files:"));
  console.log(chalk.gray(stagedFiles.map((file) => ` - ${file}`).join("\n")));

  // Get commit message from args or prompt
  let commitMessage;

  if (args.length > 0) {
    // Use message from command line
    commitMessage = args[0];
  } else {
    // Prompt for commit message
    commitMessage = await promptCommitMessage();
    if (!commitMessage) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }
  }

  // Prompt for mood
  const vibe = await promptForMoodSelection();

  // Combine commit message with vibe
  const finalMessage = `${commitMessage} ${chalk.green(vibe)}`;
  const cleanCommitMessage = stripAnsi(finalMessage);

  console.log(chalk.blue.bold("\n📝 Final Commit Message:"));
  console.log(chalk.cyan(`"${cleanCommitMessage}"\n`));

  // Run commit
  commitChanges(cleanCommitMessage);
  showSuccessMessage();
}
