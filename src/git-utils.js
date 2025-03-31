import { execSync } from "child_process";
import chalk from "chalk";
import { VIBES } from "./vibes.js";

// Write Git Message to File
export function writeGitMessageToFile(message) {
  try {
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("❌ Error writing git message to file."));
    process.exit(1);
  }
}

// Get staged files
export function getStagedFiles() {
  try {
    const files = execSync("git diff --name-only --cached").toString().trim();
    return files ? files.split("\n").filter((file) => file.trim() !== "") : [];
  } catch (error) {
    console.error(chalk.red("❌ Error checking staged files."));
    process.exit(1);
  }
}

// Get unstaged files
export function getUnstagedFiles() {
  try {
    const files = execSync(
      "git ls-files --modified --others --exclude-standard"
    )
      .toString()
      .trim();
    return files ? files.split("\n").filter((file) => file.trim() !== "") : [];
  } catch (error) {
    console.error(chalk.red("❌ Error checking unstaged files."));
    process.exit(1);
  }
}

// Stage all changes
export function stageAllChanges() {
  try {
    execSync("git add .", { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("❌ Error staging all changes."));
    process.exit(1);
  }
}

// Stage selected files
export function stageSelectedFiles(files) {
  if (!files || files.length === 0) {
    console.log(chalk.red("❌ No files selected. Cannot commit."));
    process.exit(1);
  }

  try {
    execSync(`git add ${files.join(" ")}`, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("❌ Error staging selected files."));
    process.exit(1);
  }
}

// Commit changes with message
export function commitChanges(message) {
  try {
    // Escape the message for git commit
    const escapedMessage = message.replace(/"/g, '\\"');
    execSync(`git commit -m "${escapedMessage}"`, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("❌ Error running git commit."));
    process.exit(1);
  }
}

export function getRecentVibes() {
  try {
    // Get last 5 commits with both message and hash
    const gitLog = execSync("git log -n 5 --pretty=format:'%H|%s'", {
      encoding: "utf-8",
    }).split("\n");

    // Extract vibes from commit messages
    const recentVibes = gitLog
      .map((line) => {
        const [hash, message] = line.split("|");
        // Find any vibe that appears in the message
        const vibe = VIBES.find((v) => message.includes(v.value));
        if (!vibe) return null;

        return {
          value: vibe.value,
          timestamp: getRelativeTime(hash),
        };
      })
      .filter(Boolean); // Remove null entries

    // Remove duplicates, keeping the most recent occurrence
    const uniqueVibes = recentVibes.filter(
      (vibe, index, self) =>
        index === self.findIndex((v) => v.value === vibe.value)
    );

    return uniqueVibes;
  } catch (error) {
    console.error("Error getting recent vibes:", error);
    return [];
  }
}

function getRelativeTime(commitHash) {
  try {
    const commitTime = execSync(`git show -s --format=%ct ${commitHash}`, {
      encoding: "utf-8",
    }).trim();

    const now = Math.floor(Date.now() / 1000);
    const diff = now - parseInt(commitTime);

    if (diff < 3600) return "just now";
    if (diff < 7200) return "1 hour ago";
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return "yesterday";
    return `${Math.floor(diff / 86400)} days ago`;
  } catch (error) {
    return "recently";
  }
}
