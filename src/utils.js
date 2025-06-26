import chalk from "chalk";
import { intro } from "@clack/prompts";

export function showIntro() {
  console.clear();
  intro(chalk.blue.bold("Welcome to Commit Vibes!"));
}

export function printStagedFiles(stagedFiles) {
  console.log(chalk.green("\n📂 Staged files:"));
  console.log(chalk.gray(stagedFiles.map((file) => ` - ${file}`).join("\n")));
}

export function printSpotifyTrack(track) {
  console.log(chalk.blue("\n🎵 Now Playing:"));
  console.log(chalk.gray(`  ${track.name} - ${track.artist}`));
}

export function printRecentTracks(tracks) {
  console.log(chalk.blue("\n🎵 No song currently playing"));
  console.log(chalk.gray("Recent tracks:"));
  tracks.forEach((track) => {
    console.log(
      chalk.gray(`  • "${track.name}" - ${track.artist} (${track.playedAt})`)
    );
  });
}

export function printBanner(message) {
  console.log(chalk.yellow(message));
}

export function handleError(message, error) {
  console.error(chalk.red(message));
  if (error) console.error(chalk.dim(error.message));
  process.exit(1);
}

export function exitIfCancelled(value) {
  if (!value) {
    console.log(chalk.red("❌ Commit canceled."));
    process.exit(1);
  }
}
