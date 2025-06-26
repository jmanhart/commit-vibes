import chalk from "chalk";
import { VIBES } from "../vibes.js";

export function handleListVibes() {
  console.log(chalk.blue.bold("\nAvailable Vibes:"));
  VIBES.forEach(({ value, hint }) => {
    console.log(chalk.gray(`  ${value}`));
    console.log(chalk.dim(`    ${hint}`));
  });
  console.log(); // Add empty line at end
  process.exit(0);
}
