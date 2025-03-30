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
  const message = await text({
    message: "Enter your commit message:",
    validate: (value) => {
      if (value.trim() === "") {
        return "Commit message cannot be empty.";
      }
    },
  });

  if (!message || message === "") {
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
  const recentVibes = getRecentVibes();
  console.log(chalk.dim("Found recent vibes:", recentVibes.length));

  // Create options with groups
  const options = [];

  // Add recent vibes group if any exist
  if (recentVibes.length > 0) {
    options.push({
      label: "Recent Vibes",
      options: recentVibes.map(({ value, timestamp }) => ({
        value,
        label: value,
        hint: timestamp,
      })),
    });

    // Add separator between groups
    options.push({
      label: "──────────────",
      options: [],
    });
  }

  // Add all vibes except those in recent vibes
  const recentVibeValues = recentVibes.map((v) => v.value);
  const allVibes = VIBES.filter(
    (vibe) => !recentVibeValues.includes(vibe.value)
  );
  console.log(chalk.dim("Available all vibes:", allVibes.length));

  options.push({
    label: "All Vibes",
    options: allVibes,
  });

  return await select({
    message: "How are you feeling about this commit?",
    options: options,
  });
}

// Display commit success message
export function showSuccessMessage() {
  outro(chalk.green.bold("✅ Commit successful!"));
}
