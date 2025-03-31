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
import {
  startAuthFlow,
  disconnectSpotify,
  getCurrentTrack,
  loadTokens,
} from "./spotify-auth.js";
import { confirm } from "@clack/prompts";

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
  .option("-s, --spotify", "connect your Spotify account")
  .option("-d, --disconnect", "disconnect your Spotify account")
  .addHelpText("beforeAll", HEADER)
  .addHelpText("after", HELP_CONTENT);

export async function runCLI() {
  // Initialize Spotify tokens if they exist
  await loadTokens();

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

  // Handle --spotify option
  if (options.spotify) {
    console.clear();
    intro(chalk.blue.bold("Welcome to Commit Vibes!"));
    console.log(chalk.yellow("\n🎵 Connecting to Spotify..."));
    try {
      await startAuthFlow();
      console.log(chalk.green("\n✨ Successfully connected to Spotify!"));
      console.log(
        chalk.dim(
          "Your music will now be included in commits when you're listening"
        )
      );
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("\n❌ Failed to connect to Spotify:"));
      console.error(chalk.dim(error.message));
      process.exit(1);
    }
  }

  // Handle --disconnect option
  if (options.disconnect) {
    console.clear();
    intro(chalk.blue.bold("Welcome to Commit Vibes!"));
    console.log(chalk.yellow("\n🎵 Disconnecting from Spotify..."));
    try {
      const success = await disconnectSpotify();
      if (success) {
        console.log(
          chalk.green("\n✨ Successfully disconnected from Spotify!")
        );
      } else {
        console.log(
          chalk.yellow("\nℹ️ No Spotify connection found to disconnect.")
        );
      }
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("\n❌ Failed to disconnect from Spotify:"));
      console.error(chalk.dim(error.message));
      process.exit(1);
    }
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

  // Get current playing track if Spotify is connected
  const currentTrack = await getCurrentTrack();
  if (currentTrack) {
    console.log(chalk.blue("\n🎵 Now Playing:"));
    console.log(chalk.gray(`  ${currentTrack.name} - ${currentTrack.artist}`));

    // Ask if user wants to include the song
    const includeSong = await confirm({
      message: "Add this song to your commit message?",
    });

    if (includeSong) {
      commitMessage += `\n\n🎵 Now playing: "${currentTrack.name} - ${currentTrack.artist}"`;
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
