# commit-vibes

A CLI tool that adds personality to Git commit messages with emoji-based "vibes" and optional Spotify now-playing integration.

## Project Structure

```
bin/commit-vibes.js          # Entry point (shebang script)
src/
  cli.js                     # CLI setup (Commander), routes to command handlers
  commands/
    commit.js                # Main commit workflow
    preview.js               # Dry-run preview (no actual commit)
    demo.js                  # Demo with mock data
    spotify-connect.js       # Spotify OAuth flow
    spotify-disconnect.js    # Token cleanup
    status.js                # Check Spotify connection status
    list-vibes.js            # Display available vibes
  config/
    spotify.js               # Actual Spotify credentials (gitignored)
    spotify.template.js      # Template for user setup
  vibes.js                   # 20 predefined emoji vibe options
  git-utils.js               # Git operations (staging, committing, log parsing)
  spotify-auth.js            # OAuth2 flow, token refresh, API calls
  spotify-tokens.js          # Token storage (~/.commit-vibes/spotify-tokens.json)
  prompts.js                 # Clack-based interactive prompts
  utils.js                   # Display helpers, colors, formatting
  help-text.js               # Help/usage text
  signal-handler.js          # SIGINT/SIGTERM handling
```

## Tech Stack

- **Runtime**: Node.js >=16, ESM modules (`"type": "module"`)
- **CLI Framework**: Commander for arg parsing, @clack/prompts for interactive UI
- **Styling**: Chalk for terminal colors
- **Spotify**: spotify-web-api-node for API access, OAuth2 PKCE flow
- **No build step** — runs directly as JavaScript

## Commands

```bash
node bin/commit-vibes.js              # Interactive commit flow
node bin/commit-vibes.js --preview    # Dry run, no actual commit
node bin/commit-vibes.js --demo       # Demo with mock data
node bin/commit-vibes.js --spotify    # Connect Spotify account
node bin/commit-vibes.js --disconnect # Remove Spotify tokens
node bin/commit-vibes.js --status     # Check Spotify connection
node bin/commit-vibes.js --list-vibes # Show all available vibes
```

## Key Patterns

- Commits use a temp file with `git commit -F` to avoid shell escaping issues
- Spotify tokens persist in `~/.commit-vibes/spotify-tokens.json`
- Recent vibes are extracted from the last 5 git log entries
- Graceful Ctrl+C handling via signal-handler.js with clack's `isCancel()`
- Tool works without Spotify (optional feature, degrades gracefully)

## Testing

No test framework is set up yet. Run manually:
```bash
node bin/commit-vibes.js --demo
node bin/commit-vibes.js --preview
```

## Known Issues

- `execSync()` in git-utils.js interpolates filenames directly into shell commands (command injection risk)
- `new Function()` used to parse config in spotify-auth.js (unsafe eval-like pattern)
- Significant code duplication across commit.js, preview.js, and demo.js
- `--custom-vibe <path>` CLI option is documented but not implemented
- No tests, no CI/CD
- Many `process.exit(1)` calls make error recovery and testing difficult
