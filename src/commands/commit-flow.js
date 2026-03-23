/**
 * Shared commit flow used by commit, preview, and demo modes.
 * @param {"commit" | "preview" | "demo"} mode
 * @param {string[]} args - CLI arguments (commit message)
 */
import { confirm, outro } from "@clack/prompts";
import chalk from "chalk";
import {
  promptCommitMessage,
  promptForFileSelection,
  promptForMoodSelection,
} from "../prompts.js";
import {
  stageFiles,
  commitChanges,
  getUnstagedFiles,
  getStagedFiles,
} from "../git-utils.js";
import { getCurrentTrack } from "../spotify-auth.js";
import {
  showIntro,
  printStagedFiles,
  printSpotifyTrack,
  printRecentTracks,
  handleError,
  checkCancellationState,
} from "../utils.js";

const MOCK_STAGED_FILES = ["src/demo.js", "README.md", "package.json"];

const MOCK_SPOTIFY_DATA = {
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

export async function commitFlow(mode, args) {
  const isCommit = mode === "commit";
  const isPreview = mode === "preview";
  const isDemo = mode === "demo";
  const modeLabel = isDemo ? "DEMO" : isPreview ? "PREVIEW" : null;

  try {
    showIntro();
    checkCancellationState();

    // Mode banner
    if (isPreview) {
      console.log(
        chalk.yellow(
          "👀 PREVIEW MODE - Using real git and Spotify data, but no commit will be created\n"
        )
      );
    } else if (isDemo) {
      console.log(
        chalk.yellow(
          "🎭 DEMO MODE - No real git or Spotify actions will be performed\n"
        )
      );
    }

    // Staged files
    let stagedFiles = [];
    if (isDemo) {
      stagedFiles = MOCK_STAGED_FILES;
      printStagedFiles(stagedFiles);
      checkCancellationState();
    } else {
      stagedFiles = getStagedFiles();
      if (isPreview && stagedFiles.length > 0) {
        console.log(chalk.cyan("📂 Currently staged files:"));
        printStagedFiles(stagedFiles);
        checkCancellationState();
      }
    }

    // Commit message
    let message = args[0];
    if (!message) {
      message = await promptCommitMessage();
      checkCancellationState();
    }

    if (!message) {
      console.log(chalk.red("❌ No commit message provided. Exiting."));
      process.exit(1);
    }

    // File selection
    let filesToStage = [];
    if (isDemo) {
      console.log(chalk.cyan("📁 File selection skipped in demo mode"));
      checkCancellationState();
    } else {
      const unstagedFiles = getUnstagedFiles();
      if (unstagedFiles.length > 0) {
        const selectedFiles = await promptForFileSelection();
        checkCancellationState();

        if (selectedFiles.length > 0) {
          if (isCommit) {
            stageFiles(selectedFiles);
            checkCancellationState();
          } else {
            // preview mode — show what would be staged
            filesToStage = selectedFiles;
            console.log(
              chalk.cyan(
                `\n📝 Would stage ${filesToStage.length} file(s): ${filesToStage.join(", ")}`
              )
            );
            console.log(
              chalk.gray("(No files were actually staged in preview mode)")
            );
            checkCancellationState();
          }
        }
      }
    }

    // Preview: show what files would be committed
    if (isPreview) {
      const wouldBeCommitted = [...stagedFiles, ...filesToStage];
      if (wouldBeCommitted.length === 0) {
        console.log(
          chalk.yellow(
            "\n⚠️  No files would be committed (no staged files and none selected)"
          )
        );
      } else {
        console.log(chalk.cyan("\n📦 Files that would be committed:"));
        printStagedFiles(wouldBeCommitted);
      }
    }

    // Vibe selection
    const vibe = await promptForMoodSelection();
    checkCancellationState();

    if (!vibe) {
      console.log(chalk.red("❌ No vibe selected. Exiting."));
      process.exit(1);
    }

    message = `${message} ${vibe}`;

    // Spotify
    const spotifyData = isDemo ? MOCK_SPOTIFY_DATA : await getCurrentTrack();
    checkCancellationState();

    if (spotifyData && !spotifyData.error) {
      if (spotifyData.current) {
        printSpotifyTrack(spotifyData.current);

        const includeSong = await confirm({
          message: "Add this song to your commit message?",
        });
        checkCancellationState();

        if (includeSong === undefined) {
          console.log(chalk.red(`❌ ${modeLabel || "Commit"} canceled.`));
          process.exit(1);
        }

        if (includeSong) {
          message += `\n\n🎵 Now playing: "${spotifyData.current.name} - ${spotifyData.current.artist}"`;
        }
      } else if (spotifyData.recent && spotifyData.recent.length > 0) {
        printRecentTracks(spotifyData.recent);

        const includeSong = await confirm({
          message: "Add most recent song to your commit message?",
        });
        checkCancellationState();

        if (includeSong === undefined) {
          console.log(chalk.red(`❌ ${modeLabel || "Commit"} canceled.`));
          process.exit(1);
        }

        if (includeSong) {
          const mostRecent = spotifyData.recent[0];
          message += `\n\n🎵 Last played: "${mostRecent.name} - ${mostRecent.artist}"`;
        }
      }
    }

    // Final message display
    const messageLabel = modeLabel ? `(${modeLabel})` : "";
    console.log(chalk.cyan(`\n📝 Final commit message${messageLabel ? ` ${messageLabel}` : ""}:`));
    console.log(chalk.white(message));
    console.log();

    // Preview: show summary and exit
    if (isPreview) {
      const wouldBeCommitted = [...stagedFiles, ...filesToStage];
      console.log(chalk.cyan("📊 Preview Summary:"));
      console.log(chalk.gray(`  • Files to commit: ${wouldBeCommitted.length}`));
      console.log(chalk.gray(`  • Vibe: ${vibe}`));
      if (spotifyData && !spotifyData.error && (spotifyData.current || (spotifyData.recent && spotifyData.recent.length > 0))) {
        const track = spotifyData.current || spotifyData.recent[0];
        console.log(chalk.gray(`  • Spotify: ${track.name} - ${track.artist}`));
      }
      console.log();
      outro(chalk.green("👀 Preview completed - no commit was created"));
      return;
    }

    // Confirm commit (commit and demo modes)
    const confirmMessage = isDemo
      ? "Create this commit? (DEMO - no real commit)"
      : "Create this commit?";
    const shouldCommit = await confirm({ message: confirmMessage });
    checkCancellationState();

    if (shouldCommit === undefined) {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }

    if (shouldCommit) {
      if (isCommit) {
        // Real commit — verify staged files exist
        const finalStaged = getStagedFiles();
        if (finalStaged.length === 0) {
          console.log(chalk.red("\n❌ No files staged for commit."));
          console.log(
            chalk.yellow(
              "💡 Stage files first using 'git add' or select files during the commit process."
            )
          );
          process.exit(1);
        }
        await commitChanges(message);
        outro(chalk.green("🎉 Commit created successfully!"));
      } else {
        // Demo
        console.log(chalk.green("🎉 Demo commit would be created!"));
        console.log(chalk.gray("(No real git commit performed in demo mode)"));
        outro(chalk.green("🎭 Demo completed successfully!"));
      }
    } else {
      console.log(chalk.yellow(`❌ ${isDemo ? "Demo commit" : "Commit"} canceled.`));
    }
  } catch (error) {
    const label = isDemo ? "demo" : isPreview ? "preview" : "commit";
    handleError(`❌ An error occurred during ${label}:`, error);
  }
}
