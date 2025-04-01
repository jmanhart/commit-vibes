import SpotifyWebApi from "spotify-web-api-node";
import { SPOTIFY_CONFIG } from "./config/spotify.js";
import open from "open";
import http from "http";
import { URL } from "url";
import {
  saveTokens,
  deleteTokens,
  loadTokensFromStorage,
} from "./spotify-tokens.js";
import chalk from "chalk";

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CONFIG.clientId,
  clientSecret: SPOTIFY_CONFIG.clientSecret,
  redirectUri: SPOTIFY_CONFIG.redirectUri,
});

// Load existing tokens if available
const existingTokens = loadTokens();
if (existingTokens) {
  spotifyApi.setAccessToken(existingTokens.accessToken);
  spotifyApi.setRefreshToken(existingTokens.refreshToken);
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

// Generate a random state string
function generateState() {
  return Math.random().toString(36).substring(7);
}

// Refresh token if expired
async function refreshTokenIfNeeded() {
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
  const state = generateRandomString(16);
  const scopes = SPOTIFY_CONFIG.scopes;

  // Set the state and scopes
  spotifyApi.setRedirectURI(SPOTIFY_CONFIG.redirectUri);
  spotifyApi.setState(state);

  // Create the authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  // Create a temporary server to handle the callback
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, SPOTIFY_CONFIG.redirectUri);
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    if (state !== returnedState) {
      res.writeHead(400);
      res.end("State mismatch!");
      server.close();
      return;
    }

    try {
      console.log("Received authorization code, exchanging for tokens...");
      // Exchange code for access token
      const data = await spotifyApi.authorizationCodeGrant(code);
      console.log("Successfully received tokens");

      const accessToken = data.body.access_token;
      const refreshToken = data.body.refresh_token;

      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      // Save tokens to file
      saveTokens(accessToken, refreshToken);

      // Send success response to browser
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(SUCCESS_PAGE);

      server.close();
      return spotifyApi;
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body,
        stack: error.stack,
      });
      res.writeHead(400);
      res.end(`Error getting tokens: ${error.message}`);
      server.close();
      throw error;
    }
  });

  // Start the server
  server.listen(8888, () => {
    console.log("Opening browser for Spotify authorization...");
    open(authorizeURL);
  });

  return new Promise((resolve, reject) => {
    server.on("close", () => {
      resolve(spotifyApi);
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
  const tokens = await loadTokensFromStorage();
  if (tokens) {
    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi.setRefreshToken(tokens.refresh_token);
    return true;
  }
  return false;
}
