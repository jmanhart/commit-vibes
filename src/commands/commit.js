/**
 * Main commit flow handler for commit-vibes CLI.
 * Handles staging, prompting, vibe selection, Spotify, and running the commit.
 * @param {string[]} args - CLI arguments (commit message)
 */
import { intro, outro } from "@clack/prompts";
import chalk from "chalk";
import {
  promptCommitMessage,
  promptForFileSelection,
  promptForMoodSelection,
} from "../prompts.js";
import {
  stageFiles,
  commitChanges,
  getUnstagedFiles,
  getStagedFiles,
} from "../git-utils.js";
import { getCurrentTrack } from "../spotify-auth.js";
import {
  showIntro,
  printStagedFiles,
  printSpotifyTrack,
  printRecentTracks,
  handleError,
  checkCancellationState,
} from "../utils.js";

export async function handleCommit(args) {
  try {
    showIntro();
    checkCancellationState();

    // Get commit message (from args or prompt)
    let message = args[0];
    if (!message) {
      message = await promptCommitMessage();
      checkCancellationState();
    }

    if (!message) {
      console.log(chalk.red("❌ No commit message provided. Exiting."));
      process.exit(1);
    }

    // Check for unstaged files
    const unstagedFiles = getUnstagedFiles();
    if (unstagedFiles.length > 0) {
      const selectedFiles = await promptForFileSelection();
      checkCancellationState();

      if (selectedFiles.length > 0) {
        stageFiles(selectedFiles);
        checkCancellationState();
      }
    }

    // Select vibe
    const vibe = await promptForMoodSelection();
    checkCancellationState();

    if (!vibe) {
      console.log(chalk.red("❌ No vibe selected. Exiting."));
      process.exit(1);
    }

    // Add vibe to message
    message = `${message} ${vibe}`;

    // Check Spotify for current track
    const spotifyData = await getCurrentTrack();
    checkCancellationState();

    if (spotifyData && !spotifyData.error) {
      if (spotifyData.current) {
        printSpotifyTrack(spotifyData.current);

        const { confirm } = await import("@clack/prompts");
        const includeSong = await confirm({
          message: "Add this song to your commit message?",
        });
        checkCancellationState();

        if (includeSong === undefined) {
          console.log(chalk.red("❌ Commit canceled."));
          process.exit(1);
        }

        if (includeSong) {
          message += `\n\n🎵 Now playing: "${spotifyData.current.name} - ${spotifyData.current.artist}"`;
        }
      } else if (spotifyData.recent && spotifyData.recent.length > 0) {
        printRecentTracks(spotifyData.recent);

        const { confirm } = await import("@clack/prompts");
        const includeSong = await confirm({
          message: "Add most recent song to your commit message?",
        });
        checkCancellationState();

        if (includeSong === undefined) {
          console.log(chalk.red("❌ Commit canceled."));
          process.exit(1);
        }

        if (includeSong) {
          const mostRecent = spotifyData.recent[0];
          message += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
        }
      }
    }

    // Show final commit message
    console.log(chalk.cyan("\n📝 Final commit message:"));
    console.log(chalk.white(message));
    console.log();

    // Confirm commit
    const { confirm } = await import("@clack/prompts");
    const shouldCommit = await confirm({
      message: "Create this commit?",
    });
    checkCancellationState();

    if (shouldCommit === undefined) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }

    if (shouldCommit) {
      // Double-check that there are staged files before committing
      const stagedFiles = getStagedFiles();
      if (stagedFiles.length === 0) {
        console.log(chalk.red("\n❌ No files staged for commit."));
        console.log(
          chalk.yellow(
            "💡 Stage files first using 'git add' or select files during the commit process."
          )
        );
        process.exit(1);
      }

      await commitChanges(message);
      outro(chalk.green("🎉 Commit created successfully!"));
    } else {
      console.log(chalk.yellow("❌ Commit canceled."));
    }
  } catch (error) {
    handleError("❌ An error occurred during commit:", error);
  }
}
