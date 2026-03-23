---
import DocsLayout from '../../../../layouts/DocsLayout.astro';
---

<DocsLayout title="Spotify Setup">
	<h1>Spotify Integration Setup</h1>
	<p>
		Connect your Spotify account to automatically add your currently playing song to commit messages.
		This guide will walk you through the complete setup process.
	</p>

	<h2>Prerequisites</h2>
	<ul>
		<li>A Spotify account (free or premium)</li>
		<li>Node.js installed (commit-vibes requires Node.js 16+)</li>
		<li>Basic familiarity with terminal/command line</li>
	</ul>

	<h2>Step 1: Create a Spotify App</h2>
	<p>
		First, you need to create a Spotify application in the Spotify Developer Dashboard to get API credentials.
	</p>

	<ol>
		<li>
			Go to <a href="https://developer.spotify.com/dashboard" target="_blank">Spotify Developer Dashboard</a>
		</li>
		<li>
			Log in with your Spotify account
		</li>
		<li>
			Click <strong>"Create app"</strong> or <strong>"Create an app"</strong>
		</li>
		<li>
			Fill in the app details:
			<ul>
				<li><strong>App name:</strong> Choose any name (e.g., "commit-vibes")</li>
				<li><strong>App description:</strong> Optional description</li>
				<li><strong>Redirect URI:</strong> <code>http://127.0.0.1:3000</code> (important: use IP address, not localhost)</li>
				<li><strong>Website:</strong> Optional, can leave blank or use your GitHub repo URL</li>
			</ul>
		</li>
		<li>
			Check the <strong>"I understand and agree to Spotify's Developer Terms of Service"</strong> checkbox
		</li>
		<li>
			Click <strong>"Save"</strong>
		</li>
	</ol>

	<div class="warning">
		<p><strong>Important:</strong> Spotify requires using <code>http://127.0.0.1:3000</code> instead of <code>http://localhost:3000</code> for redirect URIs. Make sure you use the IP address format.</p>
	</div>

	<h2>Step 2: Get Your Credentials</h2>
	<p>
		After creating your app, you'll need to get your Client ID and Client Secret.
	</p>

	<ol>
		<li>
			In your app's dashboard, you'll see your <strong>Client ID</strong> displayed
		</li>
		<li>
			Click <strong>"Show client secret"</strong> to reveal your <strong>Client Secret</strong>
		</li>
		<li>
			Copy both values - you'll need them in the next step
		</li>
	</ol>

	<div class="info">
		<p><strong>Security Note:</strong> Never share your Client Secret publicly. Keep it secure and don't commit it to version control.</p>
	</div>

	<h2>Step 3: Configure commit-vibes</h2>
	<p>
		Now you'll add your Spotify credentials to commit-vibes. You can use either environment variables (recommended) or a config file.
	</p>

	<h3>Option A: Environment Variables (Recommended)</h3>
	<p>
		This is the recommended approach as it keeps credentials out of your codebase.
	</p>

	<ol>
		<li>
			In your project root (or home directory for global config), create a <code>.env</code> file:
		</li>
	</ol>

	<pre><code>SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000</code></pre>

	<ol start="2">
		<li>
			Replace <code>your_client_id_here</code> and <code>your_client_secret_here</code> with your actual credentials from Step 2
		</li>
		<li>
			Make sure <code>.env</code> is in your <code>.gitignore</code> file (it should be by default)
		</li>
	</ol>

	<h3>Option B: Config File</h3>
	<p>
		Alternatively, you can create a config file in the commit-vibes source directory.
	</p>

	<ol>
		<li>
			Navigate to the commit-vibes installation directory (usually in <code>node_modules/commit-vibes/src/config/</code>)
		</li>
		<li>
			Copy the template file:
			<pre><code>cp spotify.template.js spotify.js</code></pre>
		</li>
		<li>
			Edit <code>spotify.js</code> and replace the placeholder values:
			<pre><code>export const SPOTIFY_CONFIG = {
  clientId: "your_actual_client_id",
  clientSecret: "your_actual_client_secret",
  redirectUri: "http://127.0.0.1:3000",
  scopes: ["user-read-currently-playing", "user-read-recently-played"],
};</code></pre>
		</li>
	</ol>

	<div class="warning">
		<p><strong>Note:</strong> If you installed commit-vibes globally via npm, the config file approach may be overwritten on updates. Environment variables are more persistent.</p>
	</div>

	<h2>Step 4: Set App to Development Mode</h2>
	<p>
		For local development, your Spotify app needs to be in Development Mode.
	</p>

	<ol>
		<li>
			In the Spotify Developer Dashboard, go to your app's <strong>Settings</strong>
		</li>
		<li>
			Find the <strong>"App status"</strong> or <strong>"Application type"</strong> section
		</li>
		<li>
			Make sure it's set to <strong>"Development Mode"</strong> (not Production)
		</li>
		<li>
			If in Development Mode, go to <strong>"Users and Access"</strong> and add your Spotify account email to the allowed users list
		</li>
		<li>
			Click <strong>"Save"</strong>
		</li>
	</ol>

	<div class="info">
		<p><strong>Why Development Mode?</strong> Development Mode allows you to use <code>http://</code> (non-HTTPS) redirect URIs for localhost, which is required for local development. Production Mode requires HTTPS.</p>
	</div>

	<h2>Step 5: Connect Your Account</h2>
	<p>
		Now you're ready to connect your Spotify account to commit-vibes.
	</p>

	<ol>
		<li>
			Run the connect command:
			<pre><code>commit-vibes --spotify</code></pre>
		</li>
		<li>
			Your default browser (or Chrome if configured) will open to Spotify's authorization page
		</li>
		<li>
			Log in to Spotify if prompted
		</li>
		<li>
			Review the permissions commit-vibes is requesting:
			<ul>
				<li><strong>Read your currently playing content</strong> - To show what song you're listening to</li>
				<li><strong>Read your recently played tracks</strong> - To show recent songs if nothing is currently playing</li>
			</ul>
		</li>
		<li>
			Click <strong>"Agree"</strong> or <strong>"Authorize"</strong>
		</li>
		<li>
			You'll see a success page - you can close the browser tab
		</li>
		<li>
			Return to your terminal - you should see a success message
		</li>
	</ol>

	<h2>Step 6: Verify Connection</h2>
	<p>
		Test that everything is working correctly.
	</p>

	<ol>
		<li>
			Check your connection status:
			<pre><code>commit-vibes --status</code></pre>
		</li>
		<li>
			You should see:
			<ul>
				<li>✨ Spotify is connected!</li>
				<li>Your currently playing track (if music is playing)</li>
				<li>Or your most recent track (if nothing is playing)</li>
			</ul>
		</li>
	</ol>

	<h2>Troubleshooting</h2>

	<h3>Error: "INVALID_CLIENT: Insecure redirect URI"</h3>
	<p>
		This means your redirect URI doesn't match between your code and Spotify dashboard.
	</p>
	<ul>
		<li>Make sure you're using <code>http://127.0.0.1:3000</code> (not <code>localhost</code>)</li>
		<li>Verify it's exactly the same in both your <code>.env</code> file and Spotify dashboard</li>
		<li>Check for any trailing spaces or characters</li>
		<li>Make sure your app is in Development Mode</li>
	</ul>

	<h3>Error: "Spotify token has expired"</h3>
	<p>
		Your access token has expired. Simply reconnect:
	</p>
	<pre><code>commit-vibes --spotify</code></pre>

	<h3>Error: "Spotify is not configured"</h3>
	<p>
		commit-vibes can't find your credentials. Check:
	</p>
	<ul>
		<li>Your <code>.env</code> file exists and is in the correct location</li>
		<li>The environment variables are named correctly: <code>SPOTIFY_CLIENT_ID</code>, <code>SPOTIFY_CLIENT_SECRET</code></li>
		<li>There are no typos in the variable names</li>
		<li>If using a config file, make sure it's in the correct location</li>
	</ul>

	<h3>Browser Opens Safari Instead of Chrome</h3>
	<p>
		By default, commit-vibes tries to open Chrome. If it's not available, it falls back to your default browser. To ensure Chrome opens:
	</p>
	<ul>
		<li>Make sure Chrome is installed</li>
		<li>The code will automatically try Chrome first, then fall back to default</li>
	</ul>

	<h3>Connection Works But No Music Shows</h3>
	<p>
		If your connection is successful but no music appears:
	</p>
	<ul>
		<li>Make sure Spotify is actually playing music (not paused)</li>
		<li>Try the <code>--status</code> command to see what commit-vibes detects</li>
		<li>Check that your Spotify app has the correct scopes enabled</li>
	</ul>

	<h2>Disconnecting Spotify</h2>
	<p>
		To disconnect your Spotify account:
	</p>
	<pre><code>commit-vibes --disconnect</code></pre>
	<p>
		This will remove your stored tokens. You can reconnect anytime using <code>--spotify</code>.
	</p>

	<h2>Security Best Practices</h2>
	<ul>
		<li>Never commit your <code>.env</code> file or <code>spotify.js</code> config file to version control</li>
		<li>Keep your Client Secret private - treat it like a password</li>
		<li>If you suspect your credentials are compromised, regenerate them in the Spotify Dashboard</li>
		<li>Use environment variables instead of config files when possible</li>
	</ul>

	<h2>Next Steps</h2>
	<p>
		Once Spotify is connected, you can:
	</p>
	<ul>
		<li>Use <code>commit-vibes</code> to create commits with your current song</li>
		<li>Use <code>commit-vibes --preview</code> to test without creating commits</li>
		<li>Your music will automatically be included in commit messages when available</li>
	</ul>
</DocsLayout>
