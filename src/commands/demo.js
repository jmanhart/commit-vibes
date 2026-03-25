import { commitFlow } from "./commit-flow.js";

export async function handleDemo(args, options) {
  await commitFlow("demo", args, options);
}
