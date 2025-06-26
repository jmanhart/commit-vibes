import chalk from "chalk";
import { intro } from "@clack/prompts";
import { startAuthFlow } from "../spotify-auth.js";

export async function handleSpotifyConnect() {
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
