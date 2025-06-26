import chalk from "chalk";
import { intro } from "@clack/prompts";
import { disconnectSpotify } from "../spotify-auth.js";

export async function handleSpotifyDisconnect() {
  console.clear();
  intro(chalk.blue.bold("Welcome to Commit Vibes!"));
  console.log(chalk.yellow("\n🎵 Disconnecting from Spotify..."));
  try {
    const success = await disconnectSpotify();
    if (success) {
      console.log(chalk.green("\n✨ Successfully disconnected from Spotify!"));
    } else {
      console.log(
        chalk.yellow("\nℹ️ No Spotify connection found to disconnect.")
      );
    }
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("\n❌ Failed to disconnect from Spotify:"));
    console.error(chalk.dim(error.message));
    process.exit(1);
  }
}
