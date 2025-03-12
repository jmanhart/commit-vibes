#!/usr/bin/env node

import { intro, select, confirm, outro, multiselect } from "@clack/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import stripAnsi from "strip-ansi";

const VIBES = [
  {
    value: "😌 Feelin Confident",
    label: "😌 Feelin Confident",
    hint: "This commit is rock solid.",
  },
  {
    value: "🤞 Feelin Hopeful",
    label: "🤞 Feelin Hopeful",
    hint: "I think this will work...",
  },
  {
    value: "🤔 Feelin Uncertain",
    label: "🤔 Feelin Uncertain",
    hint: "Not sure if this is right.",
  },
  {
    value: "😬 Feelin Nervous",
    label: "😬 Feelin Nervous",
    hint: "Please don’t break production.",
  },
  {
    value: "🔥 Feelin Rushed",
    label: "🔥 Feelin Rushed",
    hint: "Had to push this quickly!",
  },
  {
    value: "💀 Feelin Desperate",
    label: "💀 Feelin Desperate",
    hint: "It works, but I don’t know why.",
  },
];

// Function to check for staged files
function getStagedFiles() {
  try {
    return execSync("git diff --name-only --cached").toString().trim();
  } catch (error) {
    console.error(
      chalk.red("❌ Error checking Git status. Are you inside a repo?")
    );
    process.exit(1);
  }
}

// Function to check for unstaged files
function getUnstagedFiles() {
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

export async function runCLI() {
  console.clear();
  intro(chalk.blue.bold("Welcome to Commit Vibes!"));

  // Check for staged and unstaged files
  let stagedFiles = getStagedFiles();
  let unstagedFiles = getUnstagedFiles();

  // If no files are staged, prompt the user to stage them
  if (!stagedFiles && unstagedFiles.length > 0) {
    console.log(chalk.yellow("⚠️ No staged changes found!"));

    const stageChoice = await select({
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

    if (stageChoice === "yes") {
      execSync("git add .", { stdio: "inherit" });
      stagedFiles = getStagedFiles();
    } else if (stageChoice === "select") {
      if (unstagedFiles.length === 0) {
        console.log(
          chalk.red("❌ No unstaged files available. Cannot proceed.")
        );
        process.exit(1);
      }

      // Ensure selectedFiles is an array and prevent undefined errors
      let selectedFiles = await multiselect({
        message: "Select files to stage:",
        options: unstagedFiles.map((file) => ({ value: file, label: file })),
      });

      if (!selectedFiles || !Array.isArray(selectedFiles)) {
        selectedFiles = []; // Default to an empty array if undefined
      }

      if (selectedFiles.length === 0) {
        console.log(chalk.red("❌ No files selected. Cannot commit."));
        process.exit(1);
      }

      execSync(`git add ${selectedFiles.join(" ")}`, { stdio: "inherit" });
      stagedFiles = getStagedFiles();
    } else {
      console.log(chalk.red("❌ Commit canceled."));
      process.exit(1);
    }
  }

  if (!stagedFiles) {
    console.log(chalk.red("❌ No staged files. Cannot commit."));
    process.exit(1);
  }

  console.log(chalk.green("\n📂 Staged files:"));
  console.log(
    chalk.gray(
      stagedFiles
        .split("\n")
        .map((file) => ` - ${file}`)
        .join("\n")
    )
  );

  // Prompt for commit mood
  const vibe = await select({
    message: "How are you feeling about this commit?",
    options: VIBES,
  });

  const args = process.argv.slice(2);
  if (!args.length) {
    console.error(chalk.red.bold("❌ Error: No commit message provided!"));
    console.log(chalk.gray("Usage: commit-vibes 'Your commit message'"));
    process.exit(1);
  }

  let commitMessage = args.join(" ") + ` ${chalk.green(vibe)}`;
  const cleanCommitMessage = stripAnsi(commitMessage);

  console.log(chalk.blue.bold("\n📝 Final Commit Message:"));
  console.log(chalk.cyan(`"${cleanCommitMessage}"\n`));

  try {
    execSync(`git commit -m "${cleanCommitMessage}"`, { stdio: "inherit" });
    outro(chalk.green.bold("✅ Commit successful!"));
  } catch (error) {
    console.error(chalk.red.bold("❌ Error running git commit."));
    process.exit(1);
  }
}
