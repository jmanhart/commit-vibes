import { commitFlow } from "./commit-flow.js";

export async function handleDemo(args) {
  await commitFlow("demo", args);
}
