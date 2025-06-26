/**
 * Spotify connect command handler for commit-vibes CLI.
 * Handles connecting the user's Spotify account.
 */
import chalk from "chalk";
import { startAuthFlow } from "../spotify-auth.js";
import { showIntro, handleError } from "../utils.js";

export async function handleSpotifyConnect() {
  showIntro();
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
    handleError("\n❌ Failed to connect to Spotify:", error);
  }
}
