import SpotifyWebApi from "spotify-web-api-node";
import open from "open";
import http from "http";
import { URL } from "url";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import {
  saveTokens,
  deleteTokens,
  loadTokensFromStorage,
} from "./spotify-tokens.js";
import chalk from "chalk";

// Load environment variables from .env file (if it exists)
dotenv.config();

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Spotify config with error handling (lazy loading)
let SPOTIFY_CONFIG = null;
let spotifyApi = null;
let configLoadAttempted = false;

// Lazy load Spotify configuration (only when needed)
// Supports both .env file and config/spotify.js file
async function loadSpotifyConfig() {
  // Only try to load once
  if (configLoadAttempted) {
    return SPOTIFY_CONFIG !== null;
  }
  
  configLoadAttempted = true;
  
  // First, try to load from environment variables (.env file)
  const envClientId = process.env.SPOTIFY_CLIENT_ID;
  const envClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const envRedirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000";
  
  if (envClientId && envClientSecret) {
    // Use environment variables
    SPOTIFY_CONFIG = {
      clientId: envClientId,
      clientSecret: envClientSecret,
      redirectUri: envRedirectUri,
    };
    
    spotifyApi = new SpotifyWebApi({
      clientId: SPOTIFY_CONFIG.clientId,
      clientSecret: SPOTIFY_CONFIG.clientSecret,
      redirectUri: SPOTIFY_CONFIG.redirectUri,
    });

    // Load existing tokens if available
    const existingTokens = await loadTokensFromStorage();
    if (existingTokens) {
      spotifyApi.setAccessToken(existingTokens.access_token);
      spotifyApi.setRefreshToken(existingTokens.refresh_token);
    }
    
    return true;
  }
  
  // If not in .env, try to load from config file
  const configPath = join(__dirname, "config", "spotify.js");
  
  // Check if config file exists
  if (!existsSync(configPath)) {
    // Neither .env nor config file exists - Spotify is not configured
    // This is fine, the tool can work without Spotify
    return false;
  }

  try {
    // Read and evaluate the config file manually to avoid ES module resolution issues
    const configContent = readFileSync(configPath, "utf-8");
    
    // Extract the SPOTIFY_CONFIG export using regex
    // This is safer than eval and avoids module resolution issues
    const configMatch = configContent.match(/export\s+const\s+SPOTIFY_CONFIG\s*=\s*({[\s\S]*?});/);
    
    if (!configMatch || !configMatch[1]) {
      return false;
    }
    
    // Safely evaluate the config object
    // Using Function constructor is safer than eval for this use case
    const configObj = new Function(`return ${configMatch[1]}`)();
    
    SPOTIFY_CONFIG = configObj;
    
    if (!SPOTIFY_CONFIG || !SPOTIFY_CONFIG.clientId || !SPOTIFY_CONFIG.clientSecret) {
      return false;
    }
    
    spotifyApi = new SpotifyWebApi({
      clientId: SPOTIFY_CONFIG.clientId,
      clientSecret: SPOTIFY_CONFIG.clientSecret,
      redirectUri: SPOTIFY_CONFIG.redirectUri,
    });

    // Load existing tokens if available
    const existingTokens = await loadTokensFromStorage();
    if (existingTokens) {
      spotifyApi.setAccessToken(existingTokens.access_token);
      spotifyApi.setRefreshToken(existingTokens.refresh_token);
    }
    
    return true;
  } catch (error) {
    // Handle all errors gracefully - file read errors, syntax errors, etc.
    // This is fine, Spotify is optional
    return false;
  }
}

// Generate random state for security
function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Check if Spotify is configured (with helpful error message)
async function ensureSpotifyConfigured() {
  // Try to load config if not already attempted
  const isConfigured = await loadSpotifyConfig();
  
  if (!isConfigured || !SPOTIFY_CONFIG || !spotifyApi) {
    const configPath = join(__dirname, "config", "spotify.js");
    const templatePath = join(__dirname, "config", "spotify.template.js");
    const errorMessage = 
      `\n❌ Spotify is not configured!\n\n` +
      `To use Spotify features, you need to configure Spotify credentials.\n\n` +
      `Option 1: Use environment variables (recommended)\n` +
      `  Add to your .env file:\n` +
      `    SPOTIFY_CLIENT_ID=your_client_id\n` +
      `    SPOTIFY_CLIENT_SECRET=your_client_secret\n` +
      `    SPOTIFY_REDIRECT_URI=http://localhost:3000\n\n` +
      `Option 2: Use config file\n` +
      `  1. Copy the template file:\n` +
      `     cp "${templatePath}" "${configPath}"\n\n` +
      `  2. Edit ${configPath} and add your Spotify API credentials.\n\n` +
      `Get credentials from: https://developer.spotify.com/dashboard\n\n` +
      `Note: You can use commit-vibes without Spotify - it's optional!\n`;
    
    throw new Error(errorMessage);
  }
}

// Generate a random state string
function generateState() {
  return Math.random().toString(36).substring(7);
}

// Refresh token if expired
async function refreshTokenIfNeeded() {
  await ensureSpotifyConfigured();
  let tokens;
  try {
    tokens = await loadTokensFromStorage();
    if (!tokens) return false;

    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi.setRefreshToken(tokens.refresh_token);

    // Try to get current track to check if token is expired
    await spotifyApi.getMyCurrentPlayingTrack();
    return true;
  } catch (error) {
    if (error.statusCode === 401 && tokens) {
      try {
        // Token expired, refresh it
        const data = await spotifyApi.refreshAccessToken();
        const newTokens = {
          access_token: data.body.access_token,
          refresh_token: tokens.refresh_token,
        };
        await saveTokens(newTokens);
        spotifyApi.setAccessToken(newTokens.access_token);
        return true;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return false;
      }
    }
    return false;
  }
}

// Start the auth flow
export async function startAuthFlow() {
  await ensureSpotifyConfigured();
  const state = generateRandomString(16);
  const scopes = ["user-read-currently-playing", "user-read-recently-played"];

  // Create the authorization URL with state
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    response_type: "code",
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    state: state,
    scope: scopes.join(" "),
  });

  const authorizeURL = `https://accounts.spotify.com/authorize?${params.toString()}`;

  // Create a temporary server to handle the callback
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, SPOTIFY_CONFIG.redirectUri);
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");

      if (state !== returnedState) {
        res.writeHead(400);
        res.end("State mismatch!");
        server.close();
        return;
      }

      // Exchange code for tokens
      const data = await spotifyApi.authorizationCodeGrant(code);
      const { access_token, refresh_token } = data.body;

      // Set the tokens
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // Save tokens
      await saveTokens({ access_token, refresh_token });

      // Send success response
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <head>
            <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: #1DB954;
                color: white;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: white;
              }
              p {
                font-size: 1.1rem;
                opacity: 0.9;
                margin: 0;
              }
              .spotify-logo {
                width: 48px;
                height: 48px;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <svg class="spotify-logo" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <h1>Successfully Connected!</h1>
              <p>Your Spotify account is now linked to Commit Vibes</p>
              <p style="font-size: 0.9rem; margin-top: 1rem; opacity: 0.7;">You can close this window and return to the terminal</p>
            </div>
          </body>
        </html>
      `);

      server.close();
    } catch (error) {
      console.error("Error during authentication:", error);
      res.writeHead(400);
      res.end(`Error during authentication: ${error.message}`);
      server.close();
    }
  });

  // Start the server
  server.listen(3000, () => {
    console.log(chalk.blue("\n🎵 Connecting to Spotify..."));
    open(authorizeURL);
  });

  return new Promise((resolve, reject) => {
    server.on("close", () => {
      resolve(spotifyApi);
    });
    server.on("error", (error) => {
      reject(error);
    });
  });
}

// Format relative time
function formatRelativeTime(timestamp) {
  const now = new Date();
  const played = new Date(timestamp);
  const diffInSeconds = Math.floor((now - played) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

// Get currently playing track
export async function getCurrentTrack() {
  // Try to load config, but don't throw error if not configured
  const isConfigured = await loadSpotifyConfig();
  
  if (!isConfigured || !spotifyApi) {
    // Spotify not configured - return null to indicate no Spotify data
    return null;
  }
  
  try {
    // Check and refresh token if needed
    const isTokenValid = await refreshTokenIfNeeded();
    if (!isTokenValid) {
      return { error: "auth" };
    }

    const data = await spotifyApi.getMyCurrentPlayingTrack();
    if (data.body && data.body.item) {
      return {
        current: {
          name: data.body.item.name,
          artist: data.body.item.artists[0].name,
        },
      };
    }

    // No song playing, get recent tracks
    const recentTracks = await getRecentTracks(3);
    return {
      current: null,
      recent: recentTracks,
    };
  } catch (error) {
    if (error.statusCode === 401) {
      return { error: "auth" };
    }
    return { error: "api" };
  }
}

// Get recently played tracks
export async function getRecentTracks(limit = 3) {
  // Try to load config, but don't throw error if not configured
  const isConfigured = await loadSpotifyConfig();
  
  if (!isConfigured || !spotifyApi) {
    // Spotify not configured - return empty array
    return [];
  }
  
  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit });
    return data.body.items.map((item) => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      playedAt: formatRelativeTime(item.played_at),
    }));
  } catch (error) {
    console.error("Error getting recent tracks:", error);
    return [];
  }
}

// Disconnect from Spotify
export async function disconnectSpotify() {
  if (!spotifyApi) {
    // If not configured, tokens might still exist, so try to delete them
    await deleteTokens();
    return true;
  }
  try {
    await deleteTokens();
    spotifyApi.setAccessToken(null);
    spotifyApi.setRefreshToken(null);
    return true;
  } catch (error) {
    console.error("Error disconnecting from Spotify:", error);
    return false;
  }
}

// Load tokens from storage
export async function loadTokens() {
  if (!spotifyApi) return false;
  const tokens = await loadTokensFromStorage();
  if (tokens) {
    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi.setRefreshToken(tokens.refresh_token);
    return true;
  }
  return false;
}
