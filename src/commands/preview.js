import { commitFlow } from "./commit-flow.js";

export async function handlePreview(args, options) {
  await commitFlow("preview", args, options);
}
