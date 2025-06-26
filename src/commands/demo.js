/**
 * Demo mode handler for commit-vibes CLI.
 * Runs the CLI in demo mode with mock data and no real side effects.
 * @param {string[]} args - CLI arguments (commit message)
 */
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { promptForMoodSelection, promptCommitMessage } from "../prompts.js";
import { confirm } from "@clack/prompts";
import {
  printStagedFiles,
  printSpotifyTrack,
  printRecentTracks,
  showIntro,
  exitIfCancelled,
} from "../utils.js";

export async function handleDemo(args) {
  showIntro();
  console.log(
    chalk.yellow("🚧 Running in DEMO mode! No changes will be made. 🚧")
  );

  // Mock staged files
  let stagedFiles = ["src/index.js", "README.md"];
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

  // Mock Spotify data
  const spotifyData = {
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

  if (spotifyData) {
    if (spotifyData.current) {
      printSpotifyTrack(spotifyData.current);
      // Ask if user wants to include the song
      const includeSong = await confirm({
        message: "Add this song to your commit message?",
      });
      // Only exit if the user cancels (includeSong === undefined)
      if (includeSong === undefined) {
        console.log(chalk.red("❌ Commit canceled."));
        process.exit(1);
      }
      if (includeSong) {
        commitMessage += `\n\n🎵 Now playing: "${spotifyData.current.name} - ${spotifyData.current.artist}"`;
      }
    } else if (spotifyData.recent && spotifyData.recent.length > 0) {
      printRecentTracks(spotifyData.recent);
      // Ask if user wants to include the most recent song
      const includeSong = await confirm({
        message: "Add most recent song to your commit message?",
      });
      // Only exit if the user cancels (includeSong === undefined)
      if (includeSong === undefined) {
        console.log(chalk.red("❌ Commit canceled."));
        process.exit(1);
      }
      if (includeSong) {
        const mostRecent = spotifyData.recent[0];
        commitMessage += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
      }
    }
  }

  const cleanCommitMessage = stripAnsi(commitMessage);

  console.log(chalk.blue.bold("\n📝 Final Commit Message:"));
  console.log(chalk.cyan(`"${cleanCommitMessage}"\n`));
  console.log(chalk.yellow("Demo mode: No commit was made."));
  process.exit(0);
}
