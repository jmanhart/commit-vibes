/**
 * Main commit flow handler for commit-vibes CLI.
 * Handles staging, prompting, vibe selection, Spotify, and running the commit.
 * @param {string[]} args - CLI arguments (commit message)
 */
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import {
  getStagedFiles,
  stageAllChanges,
  stageSelectedFiles,
  commitChanges,
} from "../git-utils.js";
import {
  promptForStagingChoice,
  promptForFileSelection,
  promptForMoodSelection,
  promptCommitMessage,
  showSuccessMessage,
} from "../prompts.js";
import { getCurrentTrack } from "../spotify-auth.js";
import { confirm } from "@clack/prompts";
import {
  printStagedFiles,
  printSpotifyTrack,
  printRecentTracks,
  showIntro,
  exitIfCancelled,
} from "../utils.js";

export async function handleCommit(args) {
  showIntro();
  // Check for staged files
  let stagedFiles = getStagedFiles();

  // If no staged files, prompt user
  if (!stagedFiles.length) {
    const stageChoice = await promptForStagingChoice();
    exitIfCancelled(stageChoice);
    if (stageChoice === "yes") {
      stageAllChanges();
      stagedFiles = getStagedFiles();
    } else if (stageChoice === "select") {
      const selectedFiles = await promptForFileSelection();
      exitIfCancelled(selectedFiles);
      stageSelectedFiles(selectedFiles);
      stagedFiles = getStagedFiles();
    } else {
      exitIfCancelled(false);
    }
  }

  printStagedFiles(stagedFiles);

  // Get commit message from args or prompt
  let commitMessage;
  if (args.length > 0) {
    commitMessage = args[0];
  } else {
    commitMessage = await promptCommitMessage();
    exitIfCancelled(commitMessage);
  }

  // Prompt for mood first
  const vibe = await promptForMoodSelection();
  exitIfCancelled(vibe);
  commitMessage = `${commitMessage} - ${chalk.green(vibe)}`;

  // Get current playing track if Spotify is connected
  const spotifyData = await getCurrentTrack();

  if (spotifyData) {
    if (spotifyData.error === "auth") {
      console.log(
        chalk.yellow("\nSpotify token expired. Please reconnect with --spotify")
      );
    } else if (spotifyData.current) {
      printSpotifyTrack(spotifyData.current);

      // Ask if user wants to include the song
      const includeSong = await confirm({
        message: "Add this song to your commit message?",
      });
      exitIfCancelled(includeSong);
      if (includeSong) {
        commitMessage += `\n\n🎵 Now playing: "${spotifyData.current.name} - ${spotifyData.current.artist}"`;
      }
    } else if (spotifyData.recent && spotifyData.recent.length > 0) {
      printRecentTracks(spotifyData.recent);
      // Ask if user wants to include the most recent song
      const includeSong = await confirm({
        message: "Add most recent song to your commit message?",
      });
      exitIfCancelled(includeSong);
      if (includeSong) {
        const mostRecent = spotifyData.recent[0];
        commitMessage += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
      }
    }
  }

  const cleanCommitMessage = stripAnsi(commitMessage);

  console.log(chalk.blue.bold("\n📝 Final Commit Message:"));
  console.log(chalk.cyan(`"${cleanCommitMessage}"\n`));

  // Run commit
  commitChanges(cleanCommitMessage);
  showSuccessMessage();
}
