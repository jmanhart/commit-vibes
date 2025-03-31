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
export function saveTokens(accessToken, refreshToken) {
  ensureDirectory();
  fs.writeFileSync(
    TOKEN_FILE,
    JSON.stringify({
      accessToken,
      refreshToken,
      timestamp: Date.now(),
    })
  );
}

// Load tokens from file
export function loadTokens() {
  if (!fs.existsSync(TOKEN_FILE)) {
    return null;
  }
  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
    return data;
  } catch (error) {
    return null;
  }
}

// Delete tokens
export function deleteTokens() {
  if (fs.existsSync(TOKEN_FILE)) {
    fs.unlinkSync(TOKEN_FILE);
    return true;
  }
  return false;
}
