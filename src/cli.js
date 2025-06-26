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
import { handleStatus } from "./commands/status.js";
import { handleSpotifyConnect } from "./commands/spotify-connect.js";
import { handleSpotifyDisconnect } from "./commands/spotify-disconnect.js";
import { handleListVibes } from "./commands/list-vibes.js";
import { handleDemo } from "./commands/demo.js";
import { handleCommit } from "./commands/commit.js";

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

  if (options.status) {
    await handleStatus();
    return;
  }
  if (options.spotify) {
    await handleSpotifyConnect();
    return;
  }
  if (options.disconnect) {
    await handleSpotifyDisconnect();
    return;
  }
  if (options.listVibes) {
    handleListVibes();
    return;
  }
  if (options.demo) {
    await handleDemo(args);
    return;
  }
  await handleCommit(args);
}
