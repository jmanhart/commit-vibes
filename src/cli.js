#!/usr/bin/env node

import { intro, select, outro } from "@clack/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import stripAnsi from "strip-ansi";

const VIBES = [
  { value: "🔥", label: "🔥 Fire" },
  { value: "⚡", label: "⚡ Lightning" },
  { value: "💀", label: "💀 Skull" },
  { value: "✨", label: "✨ Sparkles" },
  { value: "🦾", label: "🦾 Bionic" },
];

export async function runCLI() {
  console.clear();
  intro(chalk.blue.bold("🎭 Welcome to Commit Vibes! 🎭"));

  const vibe = await select({
    message: "Choose a vibe for your commit:",
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
  console.log(chalk.cyan(`\"${cleanCommitMessage}\"\n`));

  try {
    execSync(`git commit -m "${cleanCommitMessage}"`, { stdio: "inherit" });
    outro(chalk.green.bold("✅ Commit successful!"));
  } catch (error) {
    console.error(chalk.red.bold("❌ Error running git commit."));
    process.exit(1);
  }
}
