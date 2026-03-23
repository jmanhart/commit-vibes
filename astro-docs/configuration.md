---
import DocsLayout from '../../../layouts/DocsLayout.astro';
---

<DocsLayout title="Configuration">
	<h1>Configuration</h1>
	<p>
		Customize commit-vibes to match your workflow and preferences. Configure integrations,
		emoji sets, and more.
	</p>

	<h2>Available Configuration Options</h2>

	<h3>Integrations</h3>
	<ul>
		<li>
			<a href="/docs/configuration/spotify">Spotify Setup</a> - Connect your Spotify account
			to add music to your commits
		</li>
	</ul>

	<h3>Customization</h3>
	<ul>
		<li>
			<a href="/docs/configuration/custom-emojis">Custom Emojis</a> - Configure your own
			emoji sets and preferences
		</li>
	</ul>

	<h2>Configuration Files</h2>
	<p>
		commit-vibes supports both global and per-project configuration. Global settings are stored
		in your home directory, while project-specific settings can be added to a
		<code>.commit-vibes.json</code> file in your project root.
	</p>

	<h2>Coming Soon</h2>
	<ul>
		<li>CLI configuration commands</li>
		<li>Interactive setup wizard</li>
		<li>Configuration file validation</li>
		<li>Import/export settings</li>
	</ul>
</DocsLayout>
