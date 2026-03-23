import { commitFlow } from "./commit-flow.js";

export async function handlePreview(args) {
  await commitFlow("preview", args);
}
