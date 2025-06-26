import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { promptForMoodSelection, promptCommitMessage } from "../prompts.js";
import { confirm } from "@clack/prompts";

export async function handleDemo(args) {
  console.log(
    chalk.yellow("🚧 Running in DEMO mode! No changes will be made. 🚧")
  );

  // Mock staged files
  let stagedFiles = ["src/index.js", "README.md"];
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
  console.log(chalk.yellow("Demo mode: No commit was made."));
  process.exit(0);
}
