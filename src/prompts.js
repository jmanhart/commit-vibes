import { select, multiselect, confirm, intro, outro } from "@clack/prompts";
import chalk from "chalk";
import { getUnstagedFiles } from "./git-utils.js";
import { VIBES } from "./vibes.js";

// Ask user if they want to stage changes
export async function promptForStagingChoice() {
  const unstagedFiles = getUnstagedFiles();

  if (!Array.isArray(unstagedFiles)) {
    console.log(
      chalk.red(
        "❌ Error: unstagedFiles is not an array. Skipping staging step."
      )
    );
    return "yes"; // Assume all files are staged if unstagedFiles is invalid
  }

  if (unstagedFiles.length === 0) {
    console.log(chalk.green("✅ All changes are already staged."));
    return "yes";
  }

  return await select({
    message: "Would you like to stage changes before committing?",
    options: [
      { value: "yes", label: "✅ Yes, stage all changes" },
      {
        value: "select",
        label: "📂 Select specific files to stage",
        disabled: unstagedFiles.length === 0,
      },
      { value: "no", label: "❌ No, cancel commit" },
    ],
  });
}

// Prompt user to select specific files to stage
export async function promptForFileSelection() {
  const unstagedFiles = getUnstagedFiles();

  // ✅ Ensure unstagedFiles is always an array
  if (!Array.isArray(unstagedFiles)) {
    console.log(
      chalk.red(
        "❌ Error: unstagedFiles is not an array. Skipping file selection."
      )
    );
    return [];
  }

  // ✅ If no unstaged files, return early
  if (unstagedFiles.length === 0) {
    console.log(
      chalk.yellow("⚠️ No unstaged files available. Moving forward.")
    );
    return [];
  }

  // ✅ Ensure Clack does not crash on an empty selection
  const selectedFiles =
    (await multiselect({
      message: "Select files to stage:",
      options: unstagedFiles.map((file) => ({ value: file, label: file })),
    })) ?? [];

  if (!Array.isArray(selectedFiles)) {
    console.log(chalk.yellow("⚠️ No files selected. Skipping staging."));
    return [];
  }

  return selectedFiles;
}

// Prompt user for mood selection
export async function promptForMoodSelection() {
  return await select({
    message: "How are you feeling about this commit?",
    options: VIBES,
  });
}

// Display commit success message
export function showSuccessMessage() {
  outro(chalk.green.bold("✅ Commit successful!"));
}
