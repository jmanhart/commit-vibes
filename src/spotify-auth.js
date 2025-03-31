import SpotifyWebApi from "spotify-web-api-node";
import { SPOTIFY_CONFIG } from "./config/spotify.js";
import open from "open";
import http from "http";
import { URL } from "url";
import { saveTokens, loadTokens, deleteTokens } from "./spotify-tokens.js";

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

// Start the auth flow
export async function startAuthFlow() {
  const state = generateRandomString(16);
  const scopes = SPOTIFY_CONFIG.scopes;

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
      res.end(`
        <html>
          <head>
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

// Get currently playing track
export async function getCurrentTrack() {
  try {
    const data = await spotifyApi.getMyCurrentPlayingTrack();
    if (data.body && data.body.item) {
      return {
        name: data.body.item.name,
        artist: data.body.item.artists[0].name,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting current track:", error);
    return null;
  }
}

// Get recently played tracks
export async function getRecentTracks(limit = 5) {
  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit });
    return data.body.items.map((item) => ({
      name: item.track.name,
      artist: item.track.artists[0].name,
      playedAt: item.played_at,
    }));
  } catch (error) {
    console.error("Error getting recent tracks:", error);
    return [];
  }
}

// Disconnect from Spotify
export async function disconnectSpotify() {
  try {
    deleteTokens();
    spotifyApi.setAccessToken(null);
    spotifyApi.setRefreshToken(null);
    return true;
  } catch (error) {
    console.error("Error disconnecting from Spotify:", error);
    return false;
  }
}
