import {
  select,
  multiselect,
  confirm,
  intro,
  outro,
  text,
} from "@clack/prompts";
import chalk from "chalk";
import { getUnstagedFiles, getRecentVibes } from "./git-utils.js";
import { VIBES } from "./vibes.js";
import { checkCancellation, forceExit } from "./signal-handler.js";

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

// Asking the user for the commit message
export async function promptCommitMessage() {
  if (checkCancellation()) {
    console.log(chalk.red("❌ Operation cancelled"));
    forceExit();
  }

  const message = await text({
    message: "What's your commit message?",
    placeholder: "e.g., fix: resolve login bug",
  });

  if (message === null || message === undefined) {
    return null;
  }

  return message;
}

// Ask if user wants to add more files before committing
export async function promptForAdditionalFiles() {
  return await select({
    message: "Would you like to add more files before committing?",
    options: [
      { value: "yes", label: "✅ Yes, select files to add" },
      { value: "no", label: "❌ No, continue to commit" },
    ],
  });
}

// Show multi-select for unstaged files
export async function promptForFileSelection() {
  if (checkCancellation()) {
    console.log(chalk.red("❌ Operation cancelled"));
    forceExit();
  }

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

  const selectedFiles = await multiselect({
    message: "Select files to stage (space to select, enter to confirm):",
    options: [
      {
        value: "__SELECT_ALL__",
        label: "📦 Stage All Files",
        hint: `(${unstagedFiles.length} files)`,
      },
      ...unstagedFiles.map((file) => ({
        value: file,
        label: file,
      })),
    ],
    required: false,
    initialValues: [],
  });

  if (!Array.isArray(selectedFiles)) {
    console.log(
      chalk.yellow(
        "⚠️ No files selected. Skipping staging. Use space bar to select files, or choose 'Stage All Files' to stage everything."
      )
    );
    return [];
  }

  // Handle "Select All" option
  if (selectedFiles.includes("__SELECT_ALL__")) {
    return unstagedFiles;
  }

  // Confirm before staging
  const confirmSelection = await confirm({
    message: `Are you sure you want to stage ${selectedFiles.length} file(s)?`,
  });

  return confirmSelection ? selectedFiles : [];
}

// Prompt user for mood selection
export async function promptForMoodSelection() {
  if (checkCancellation()) {
    console.log(chalk.red("❌ Operation cancelled"));
    forceExit();
  }

  const recentVibes = getRecentVibes();
  const options = [];

  if (recentVibes.length > 0) {
    options.push(
      ...recentVibes.map(({ value, timestamp }) => {
        const vibe = VIBES.find((v) => v.value === value);
        // Add null check to prevent Symbol conversion error
        if (!vibe) {
          return {
            value,
            label: value,
            hint: `Used ${timestamp}`,
          };
        }
        return {
          value,
          label: value,
          hint: `${vibe.hint} - Used ${timestamp}`,
        };
      })
    );
  }

  const recentVibeValues = recentVibes.map((v) => v.value);
  const allVibes = VIBES.filter(
    (vibe) => !recentVibeValues.includes(vibe.value)
  );

  options.push(
    ...allVibes.map((vibe) => ({
      value: vibe.value,
      label: vibe.value,
      hint: vibe.hint,
    }))
  );

  try {
    const result = await select({
      message: "How are you feeling about this commit?",
      options: options,
    });

    if (result === null || result === undefined) {
      return null;
    }

    return result;
  } catch (error) {
    // Handle Symbol conversion error gracefully
    console.log(chalk.yellow("⚠️ Using default vibe due to prompt error"));
    return "🎉 Victory";
  }
}

// Display commit success message
export function showSuccessMessage() {
  outro(chalk.green.bold("✅ Commit successful!"));
}
