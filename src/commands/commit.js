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

export async function handleCommit(args) {
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

  // Get current playing track if Spotify is connected
  const spotifyData = await getCurrentTrack();

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

  // Run commit
  commitChanges(cleanCommitMessage);
  showSuccessMessage();
}
