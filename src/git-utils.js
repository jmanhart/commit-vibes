import { execSync } from "child_process";
import chalk from "chalk";

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

// Run Git commit
export function commitChanges(message) {
  try {
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red.bold("❌ Error running git commit."));
    process.exit(1);
  }
}
