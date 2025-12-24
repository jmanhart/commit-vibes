/**
 * Demo mode handler for commit-vibes CLI.
 * Runs the CLI in demo mode with mock data and no real side effects.
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
  showIntro,
  printStagedFiles,
  printSpotifyTrack,
  printRecentTracks,
  handleError,
  checkCancellationState,
} from "../utils.js";

export async function handleDemo(args) {
  try {
    showIntro();
    checkCancellationState();

    console.log(
      chalk.yellow(
        "🎭 DEMO MODE - No real git or Spotify actions will be performed\n"
      )
    );

    // Mock staged files
    const mockStagedFiles = ["src/demo.js", "README.md", "package.json"];
    printStagedFiles(mockStagedFiles);
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

    // Mock file selection (skip actual selection in demo)
    console.log(chalk.cyan("📁 File selection skipped in demo mode"));
    checkCancellationState();

    // Select vibe
    const vibe = await promptForMoodSelection();
    checkCancellationState();

    if (!vibe) {
      console.log(chalk.red("❌ No vibe selected. Exiting."));
      process.exit(1);
    }

    // Add vibe to message
    message = `${message} ${vibe}`;

    // Mock Spotify data
    const mockSpotifyData = {
      current: {
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
      },
      recent: [
        {
          name: "Hotel California",
          artist: "Eagles",
          album: "Hotel California",
        },
        {
          name: "Stairway to Heaven",
          artist: "Led Zeppelin",
          album: "Led Zeppelin IV",
        },
        { name: "Imagine", artist: "John Lennon", album: "Imagine" },
      ],
    };

    printSpotifyTrack(mockSpotifyData.current);
    checkCancellationState();

    // Ask if user wants to include the song
    const { confirm } = await import("@clack/prompts");
    const includeSong = await confirm({
      message: "Add this song to your commit message?",
    });
    checkCancellationState();

    // Only exit if the user cancels (includeSong === undefined)
    if (includeSong === undefined) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }

    if (includeSong) {
      message += `\n\n🎵 Now playing: "${mockSpotifyData.current.name} - ${mockSpotifyData.current.artist}"`;
    }

    // Show final commit message
    console.log(chalk.cyan("\n📝 Final commit message (DEMO):"));
    console.log(chalk.white(message));
    console.log();

    // Confirm commit
    const shouldCommit = await confirm({
      message: "Create this commit? (DEMO - no real commit)",
    });
    checkCancellationState();

    if (shouldCommit === undefined) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }

    if (shouldCommit) {
      console.log(chalk.green("🎉 Demo commit would be created!"));
      console.log(chalk.gray("(No real git commit performed in demo mode)"));
      outro(chalk.green("🎭 Demo completed successfully!"));
    } else {
      console.log(chalk.yellow("❌ Demo commit canceled."));
    }
  } catch (error) {
    handleError("❌ An error occurred during demo:", error);
  }
}
