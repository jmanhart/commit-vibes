import fs from "fs";
import path from "path";
import os from "os";

const TOKEN_FILE = path.join(
  os.homedir(),
  ".commit-vibes",
  "spotify-tokens.json"
);

// Ensure the .commit-vibes directory exists
function ensureDirectory() {
  const dir = path.dirname(TOKEN_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Save tokens to file
export function saveTokens({ access_token, refresh_token }) {
  ensureDirectory();
  fs.writeFileSync(
    TOKEN_FILE,
    JSON.stringify({ access_token, refresh_token }, null, 2)
  );
}

// Load tokens from file
export function loadTokensFromStorage() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };
    }
  } catch (error) {
    console.error("Error loading tokens:", error);
  }
  return null;
}

// Delete tokens file
export function deleteTokens() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      fs.unlinkSync(TOKEN_FILE);
    }
  } catch (error) {
    console.error("Error deleting tokens:", error);
  }
}
