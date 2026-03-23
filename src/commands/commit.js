import { commitFlow } from "./commit-flow.js";

export async function handleCommit(args) {
  await commitFlow("commit", args);
}
