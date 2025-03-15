#!/usr/bin/env node

import { intro } from "@clack/prompts";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
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

export async function runCLI() {
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

  // Prompt for commit message
  const commitMessage = await promptCommitMessage();
  if (!commitMessage) {
    console.log(chalk.red("❌ Commit canceled."));
    process.exit(1);
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
