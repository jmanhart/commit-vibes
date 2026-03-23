---
import DocsLayout from '../../../../layouts/DocsLayout.astro';
---

<DocsLayout title="Custom Emojis">
	<h1>Custom Emoji Configuration</h1>
	<p>
		Customize the emoji "vibes" available in commit-vibes to match your team's style and preferences.
		You can add your own emoji sets, modify existing ones, or create project-specific vibes.
	</p>

	<h2>Understanding Vibes</h2>
	<p>
		In commit-vibes, "vibes" are emoji-based mood indicators that you add to your commit messages.
		Each vibe consists of:
	</p>
	<ul>
		<li><strong>Value:</strong> The emoji and text that appears in the commit message (e.g., "🎉 Victory")</li>
		<li><strong>Label:</strong> How it appears in the selection menu</li>
		<li><strong>Hint:</strong> A helpful description shown when selecting</li>
	</ul>

	<h2>Default Vibes</h2>
	<p>
		commit-vibes comes with 20+ pre-configured vibes including:
	</p>
	<ul>
		<li>😤 Frustrated - When debugging takes forever</li>
		<li>🎉 Victory - When something finally works</li>
		<li>🔥 Big Energy - Refactoring everything</li>
		<li>💀 It Works... Somehow - No idea why it runs</li>
		<li>🚀 Shipped It - Deployed to production</li>
		<li>And many more...</li>
	</ul>

	<p>
		View all available vibes with:
	</p>
	<pre><code>commit-vibes --list-vibes</code></pre>

	<h2>Creating Custom Vibes</h2>
	<p>
		To create your own custom vibes, you'll need to create a configuration file. Currently, this requires
		modifying the source code, but we're working on a simpler configuration system.
	</p>

	<h3>Option 1: Modify the Source (Advanced)</h3>
	<p>
		If you've installed commit-vibes locally or cloned the repository:
	</p>

	<ol>
		<li>
			Navigate to the commit-vibes source directory:
			<pre><code>cd node_modules/commit-vibes/src</code></pre>
			Or if you cloned the repo:
			<pre><code>cd commit-vibes/src</code></pre>
		</li>
		<li>
			Open <code>vibes.js</code>
		</li>
		<li>
			Add your custom vibes to the <code>VIBES</code> array. Each vibe follows this structure:
			<pre><code>{
  value: "🎨 Your Emoji Text",
  label: "🎨 Your Emoji Text",
  hint: "Description of when to use this vibe"
}</code></pre>
		</li>
	</ol>

	<h3>Vibe Structure Explained</h3>
	<pre><code>{
  value: "🎨 Custom Vibe",        // What appears in commit message
  label: "🎨 Custom Vibe",         // What shows in selection menu
  hint: "When you want to express creativity"  // Helpful description
}</code></pre>

	<h3>Example Custom Vibes</h3>
	<pre><code>{
  value: "🧪 Testing Time",
  label: "🧪 Testing Time",
  hint: "Writing tests or fixing test failures"
},
{
  value: "📚 Documentation",
  label: "📚 Documentation",
  hint: "Updating docs or README files"
},
{
  value: "🎯 Focus Mode",
  label: "🎯 Focus Mode",
  hint: "Deep work session, major feature"
},
{
  value: "☕ Coffee Break",
  label: "☕ Coffee Break",
  hint: "Quick fixes between breaks"
}</code></pre>

	<h2>Best Practices for Custom Vibes</h2>

	<h3>Emoji Selection</h3>
	<ul>
		<li>Use emojis that are widely supported across platforms</li>
		<li>Avoid overly complex or obscure emojis</li>
		<li>Keep emoji + text combinations short (under 30 characters)</li>
		<li>Test that emojis render correctly in your terminal</li>
	</ul>

	<h3>Naming Conventions</h3>
	<ul>
		<li>Keep vibe names descriptive but concise</li>
		<li>Use consistent formatting (emoji + space + text)</li>
		<li>Make hints helpful - explain when to use the vibe</li>
	</ul>

	<h3>Organization</h3>
	<ul>
		<li>Group related vibes together in your array</li>
		<li>Order them by frequency of use (most common first)</li>
		<li>Consider your team's workflow when creating vibes</li>
	</ul>

	<h2>Project-Specific Vibes</h2>
	<p>
		You can create project-specific vibes by modifying the vibes file in a local installation.
		For example, if you're working on a design system project, you might add:
	</p>

	<pre><code>{
  value: "🎨 Design System",
  label: "🎨 Design System",
  hint: "Updating component library or design tokens"
},
{
  value: "🌈 Theming",
  label: "🌈 Theming",
  hint: "Working on themes, colors, or styling"
}</code></pre>

	<h2>Recent Vibes Feature</h2>
	<p>
		commit-vibes automatically tracks your recently used vibes and shows them at the top of the
		selection menu for quick access. This makes it easy to reuse your favorite vibes without
		scrolling through the entire list.
	</p>

	<h2>Limitations and Future Improvements</h2>
	<p>
		Currently, customizing vibes requires modifying source code. We're working on:
	</p>
	<ul>
		<li>Configuration file support (<code>.commit-vibes.json</code>)</li>
		<li>CLI commands to add/remove vibes</li>
		<li>Import/export vibe sets</li>
		<li>Team-shared vibe configurations</li>
		<li>Vibe presets for different project types</li>
	</ul>

	<h2>Troubleshooting</h2>

	<h3>Custom Vibes Not Appearing</h3>
	<ul>
		<li>Make sure you saved the <code>vibes.js</code> file</li>
		<li>If installed globally, changes might be overwritten on updates</li>
		<li>Try reinstalling or using a local installation</li>
	</ul>

	<h3>Emojis Not Displaying Correctly</h3>
	<ul>
		<li>Ensure your terminal supports emoji rendering</li>
		<li>Check that you're using a modern terminal (iTerm2, Windows Terminal, etc.)</li>
		<li>Some older terminals may not support all emojis</li>
	</ul>

	<h3>Vibes List Too Long</h3>
	<ul>
		<li>Use the recent vibes feature - your most used vibes appear first</li>
		<li>Consider removing vibes you never use</li>
		<li>Group similar vibes together</li>
	</ul>

	<h2>Sharing Vibe Sets</h2>
	<p>
		To share your custom vibes with your team:
	</p>
	<ol>
		<li>Export your <code>VIBES</code> array from <code>vibes.js</code></li>
		<li>Share the configuration with your team</li>
		<li>Each team member can copy it into their local installation</li>
	</ol>

	<p>
		<strong>Note:</strong> In the future, we'll support team-shared configurations via config files.
	</p>

	<h2>Examples by Use Case</h2>

	<h3>For Frontend Developers</h3>
	<pre><code>{
  value: "🎨 UI Polish",
  label: "🎨 UI Polish",
  hint: "Improving visual design or UX"
},
{
  value: "📱 Responsive",
  label: "📱 Responsive",
  hint: "Mobile or responsive design work"
},
{
  value: "⚡ Performance",
  label: "⚡ Performance",
  hint: "Optimizing load times or rendering"
}</code></pre>

	<h3>For Backend Developers</h3>
	<pre><code>{
  value: "🔧 API Changes",
  label: "🔧 API Changes",
  hint: "Modifying endpoints or API structure"
},
{
  value: "🗄️ Database",
  label: "🗄️ Database",
  hint: "Schema changes or queries"
},
{
  value: "🔐 Security",
  label: "🔐 Security",
  hint: "Security improvements or fixes"
}</code></pre>

	<h3>For DevOps</h3>
	<pre><code>{
  value: "🚀 Deployment",
  label: "🚀 Deployment",
  hint: "CI/CD or deployment changes"
},
{
  value: "🐳 Docker",
  label: "🐳 Docker",
  hint: "Container or infrastructure changes"
},
{
  value: "☁️ Cloud",
  label: "☁️ Cloud",
  hint: "Cloud infrastructure or services"
}</code></pre>
</DocsLayout>
