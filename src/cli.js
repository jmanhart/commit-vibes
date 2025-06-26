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
  .option("--status", "show if Spotify is connected")
  .option("--demo", "run in demo mode (no real git or Spotify actions)")
  .addHelpText("beforeAll", HEADER)
  .addHelpText("after", HELP_CONTENT);

export async function runCLI() {
  // Initialize Spotify tokens if they exist
  await loadTokens();

  // Parse command line arguments
  program.parse();
  const options = program.opts();
  const args = program.args;

  const isDemo = options.demo;
  if (isDemo) {
    console.log(
      chalk.yellow("🚧 Running in DEMO mode! No changes will be made. 🚧")
    );
  }

  // Handle --status option
  if (options.status) {
    console.clear();
    intro(chalk.blue.bold("Welcome to Commit Vibes!"));
    console.log(chalk.yellow("\n🎵 Checking Spotify connection..."));

    try {
      const spotifyData = await getCurrentTrack();

      if (!spotifyData) {
        console.log(chalk.yellow("\nℹ️ Spotify is not connected."));
        console.log(chalk.dim("Use --spotify to connect your account"));
      } else if (spotifyData.error === "auth") {
        console.log(chalk.red("\n❌ Spotify token has expired."));
        console.log(chalk.dim("Please reconnect with --spotify"));
      } else {
        console.log(chalk.green("\n✨ Spotify is connected!"));

        if (spotifyData.current) {
          console.log(chalk.blue("\n🎵 Now Playing:"));
          console.log(
            chalk.gray(
              `  ${spotifyData.current.name} - ${spotifyData.current.artist}`
            )
          );
        } else if (spotifyData.recent && spotifyData.recent.length > 0) {
          console.log(chalk.blue("\n🎵 No song currently playing"));
          console.log(chalk.gray("Most recent track:"));
          const mostRecent = spotifyData.recent[0];
          console.log(
            chalk.gray(
              `  "${mostRecent.name}" - ${mostRecent.artist} (${mostRecent.playedAt})`
            )
          );
        }
      }
      process.exit(0);
    } catch (error) {
      console.error(chalk.red("\n❌ Error checking Spotify status:"));
      console.error(chalk.dim(error.message));
      process.exit(1);
    }
  }

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

  // In demo mode, mock staged files
  let stagedFiles;
  if (isDemo) {
    stagedFiles = ["src/index.js", "README.md"];
  } else {
    stagedFiles = getStagedFiles();
  }

  // If no staged files, prompt user (skip actual staging in demo)
  if (!stagedFiles.length) {
    if (isDemo) {
      stagedFiles = ["src/index.js", "README.md"];
      console.log(
        chalk.gray("(Demo) Mock staged files: src/index.js, README.md")
      );
    } else {
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
  }

  console.log(chalk.green("\n📂 Staged files:"));
  console.log(chalk.gray(stagedFiles.map((file) => ` - ${file}`).join("\n")));

  // Get commit message from args or prompt
  let commitMessage;
  if (args.length > 0) {
    commitMessage = args[0];
  } else {
    commitMessage = await promptCommitMessage();
    if (!commitMessage) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }
  }

  // Prompt for mood first
  const vibe = await promptForMoodSelection();
  commitMessage = `${commitMessage} - ${chalk.green(vibe)}`;

  // In demo mode, mock Spotify data
  let spotifyData;
  if (isDemo) {
    spotifyData = {
      current: {
        name: "Demo Song",
        artist: "Demo Artist",
      },
      recent: [
        {
          name: "Old Demo Song",
          artist: "Old Demo Artist",
          playedAt: "2 hours ago",
        },
      ],
    };
  } else {
    spotifyData = await getCurrentTrack();
  }

  if (spotifyData) {
    if (spotifyData.error === "auth") {
      console.log(
        chalk.yellow("\nSpotify token expired. Please reconnect with --spotify")
      );
    } else if (spotifyData.current) {
      console.log(chalk.blue("\n🎵 Now Playing:"));
      console.log(
        chalk.gray(
          `  ${spotifyData.current.name} - ${spotifyData.current.artist}`
        )
      );

      // Ask if user wants to include the song
      const includeSong = await confirm({
        message: "Add this song to your commit message?",
      });

      if (includeSong) {
        commitMessage += `\n\n🎵 Now playing: "${spotifyData.current.name} - ${spotifyData.current.artist}"`;
      }
    } else if (spotifyData.recent && spotifyData.recent.length > 0) {
      console.log(chalk.blue("\n🎵 No song currently playing"));
      console.log(chalk.gray("Recent tracks:"));
      spotifyData.recent.forEach((track) => {
        console.log(
          chalk.gray(
            `  • "${track.name}" - ${track.artist} (${track.playedAt})`
          )
        );
      });

      // Ask if user wants to include the most recent song
      const includeSong = await confirm({
        message: "Add most recent song to your commit message?",
      });

      if (includeSong) {
        const mostRecent = spotifyData.recent[0];
        commitMessage += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
      }
    }
  }

  const cleanCommitMessage = stripAnsi(commitMessage);

  console.log(chalk.blue.bold("\n📝 Final Commit Message:"));
  console.log(chalk.cyan(`"${cleanCommitMessage}"\n`));

  if (isDemo) {
    console.log(chalk.yellow("Demo mode: No commit was made."));
    process.exit(0);
  }

  // Run commit
  commitChanges(cleanCommitMessage);
  showSuccessMessage();
}
