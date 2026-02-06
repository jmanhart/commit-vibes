/**
 * Preview mode handler for commit-vibes CLI.
 * Runs the full commit flow with real git and Spotify data, but doesn't actually commit.
 * @param {string[]} args - CLI arguments (commit message)
 */
import { outro } from "@clack/prompts";
import chalk from "chalk";
import {
  promptCommitMessage,
  promptForFileSelection,
  promptForMoodSelection,
} from "../prompts.js";
import {
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

export async function handlePreview(args) {
  try {
    showIntro();
    checkCancellationState();

    console.log(
      chalk.yellow(
        "👀 PREVIEW MODE - Using real git and Spotify data, but no commit will be created\n"
      )
    );

    // Show current staged files (real git state)
    const currentStagedFiles = getStagedFiles();
    if (currentStagedFiles.length > 0) {
      console.log(chalk.cyan("📂 Currently staged files:"));
      printStagedFiles(currentStagedFiles);
      checkCancellationState();
    }

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

    // Check for unstaged files (real git state)
    const unstagedFiles = getUnstagedFiles();
    let filesToStage = [];
    
    if (unstagedFiles.length > 0) {
      const selectedFiles = await promptForFileSelection();
      checkCancellationState();

      if (selectedFiles.length > 0) {
        filesToStage = selectedFiles;
        console.log(
          chalk.cyan(
            `\n📝 Would stage ${filesToStage.length} file(s): ${filesToStage.join(", ")}`
          )
        );
        console.log(
          chalk.gray("(No files were actually staged in preview mode)")
        );
        checkCancellationState();
      }
    }

    // Show what files would be committed
    const wouldBeCommitted = [
      ...currentStagedFiles,
      ...filesToStage,
    ];
    
    if (wouldBeCommitted.length === 0) {
      console.log(
        chalk.yellow(
          "\n⚠️  No files would be committed (no staged files and none selected)"
        )
      );
    } else {
      console.log(chalk.cyan("\n📦 Files that would be committed:"));
      printStagedFiles(wouldBeCommitted);
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

    // Check Spotify for current track (real Spotify)
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
          console.log(chalk.red("❌ Preview canceled."));
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
          console.log(chalk.red("❌ Preview canceled."));
          process.exit(1);
        }

        if (includeSong) {
          const mostRecent = spotifyData.recent[0];
          message += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
        }
      }
    }

    // Show final commit message
    console.log(chalk.cyan("\n📝 Final commit message (PREVIEW):"));
    console.log(chalk.white(message));
    console.log();

    // Show summary
    console.log(chalk.cyan("📊 Preview Summary:"));
    console.log(chalk.gray(`  • Files to commit: ${wouldBeCommitted.length}`));
    console.log(chalk.gray(`  • Vibe: ${vibe}`));
    if (spotifyData && !spotifyData.error && (spotifyData.current || (spotifyData.recent && spotifyData.recent.length > 0))) {
      const track = spotifyData.current || spotifyData.recent[0];
      console.log(chalk.gray(`  • Spotify: ${track.name} - ${track.artist}`));
    }
    console.log();

    outro(chalk.green("👀 Preview completed - no commit was created"));
  } catch (error) {
    handleError("❌ An error occurred during preview:", error);
  }
}
