# Commit Vibes 🎵

Add vibes and music to your commits! Because why not make your git history a bit more fun!

## Features

- 🎵 Spotify integration - add your current song to commits
- 🎨 Express your commit feelings with emojis
- 🎯 Quick file staging with multi-select
- 🎮 Interactive CLI with Clack

## Quick Start

```bash
# Install
npm install -g commit-vibes

# Connect Spotify (one-time setup)
commit-vibes --spotify

# Make a commit with vibes
commit-vibes "your message"
```

## Usage

1. Stage your changes (or use `commit-vibes` to stage interactively)
2. Enter your commit message
3. Select your vibe
4. If you're playing music, choose to include it in your commit

## Commands

- `commit-vibes` - Interactive commit with vibes
- `commit-vibes "message"` - Quick commit with message
- `commit-vibes --spotify` - Connect Spotify
- `commit-vibes --disconnect` - Disconnect Spotify

## Example Commit

```
feat: add new feature 🎉 Victory

🎵 Now playing: "Song Name - Artist Name"
```

## Development

```bash
# Clone & install
git clone https://github.com/yourusername/commit-vibes.git
cd commit-vibes
npm install

# Run locally
npm link
commit-vibes
```

## License

MIT

---
