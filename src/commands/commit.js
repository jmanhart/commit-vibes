import { commitFlow } from "./commit-flow.js";

export async function handleCommit(args, options) {
  await commitFlow("commit", args, options);
}
