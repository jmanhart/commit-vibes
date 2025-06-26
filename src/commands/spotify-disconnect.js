/**
 * Spotify disconnect command handler for commit-vibes CLI.
 * Handles disconnecting the user's Spotify account.
 */
import chalk from "chalk";
import { disconnectSpotify } from "../spotify-auth.js";
import { showIntro, handleError } from "../utils.js";

export async function handleSpotifyDisconnect() {
  showIntro();
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
    handleError("\n❌ Failed to disconnect from Spotify:", error);
  }
}
