import dotenv from "dotenv";
import { config } from "dotenv";

config(); // Load .env file

export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  scopes: ["user-read-currently-playing", "user-read-recently-played"],
};
