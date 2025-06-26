/**
 * Status command handler for commit-vibes CLI.
 * Shows Spotify connection status and current/recent track info.
 */
import chalk from "chalk";
import { getCurrentTrack } from "../spotify-auth.js";
import { showIntro, handleError } from "../utils.js";

export async function handleStatus() {
  showIntro();
  console.log(chalk.yellow("\n🎵 Checking Spotify connection..."));

  try {
    const spotifyData = await getCurrentTrack();

    if (!spotifyData) {
      console.log(chalk.yellow("\nℹ️ Spotify is not connected."));
      console.log(chalk.dim("Use --spotify to connect your account"));
    } else if (spotifyData.error === "auth") {
      console.log(chalk.red("\n❌ Spotify token has expired."));
      console.log(chalk.dim("Please reconnect with --spotify"));
    } else {
      console.log(chalk.green("\n✨ Spotify is connected!"));

      if (spotifyData.current) {
        console.log(chalk.blue("\n🎵 Now Playing:"));
        console.log(
          chalk.gray(
            `  ${spotifyData.current.name} - ${spotifyData.current.artist}`
          )
        );
      } else if (spotifyData.recent && spotifyData.recent.length > 0) {
        console.log(chalk.blue("\n🎵 No song currently playing"));
        console.log(chalk.gray("Most recent track:"));
        const mostRecent = spotifyData.recent[0];
        console.log(
          chalk.gray(
            `  "${mostRecent.name}" - ${mostRecent.artist} (${mostRecent.playedAt})`
          )
        );
      }
    }
    process.exit(0);
  } catch (error) {
    handleError("\n❌ Error checking Spotify status:", error);
  }
}
