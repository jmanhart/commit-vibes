# Commit Vibes

**Commit Vibes** is a CLI tool that lets you add **your mood** to every Git commit. Keep your commit history expressive, fun, and full of personality! 🎵🚀

## 🚀 Installation

Install globally via npm:

```sh
npm install -g commit-vibes
```

## 🎭 How It Works

When making a commit, **Commit Vibes** asks you how you're feeling about it and appends your selected vibe to the message.

```sh
commit-vibes "Your message"
```

You'll be prompted to pick a mood, and the commit will look something like:

```
Refactored API calls 😌 Feelin Confident
```

## Features

✅ **Staging check** – Avoid committing when no files are staged\ (WIP)
✅ **Stage files easily** – Select individual files or stage everything\ (WIP)
✅ **Adding a commit message** – If you forget to add a message we got you covered
✅ **Fun, expressive commit history** – Make Git logs more human\

## 🛠️ Usage

### **Making a Commit with Vibes**

1. Run:
   ```sh
   commit-vibes "Your commit message"
   ```
2. Handling Staging Step

   ```
   ⚠️ No staged changes found!
   Would you like to stage changes before committing?
   ✅ Yes, stage all changes
   📂 Select specific files to stage
   ❌ No, cancel commit
   ```

3. Select a **mood** from the list:
   ```
   How are you feeling about this commit?
   ● 😤 Frustrated (When debugging takes forever)
   ○ 🎉 Victory
   ○ 🤔 Questionable Commit
   ○ 🔥 Big Energy
   ○ 💀 It Works... Somehow
   ○ 🚀 Shipped It
   ○ 😅 Desperate Fix
   ○ 🛠 Fixing Tech Debt
   ○ 🤡 Hacky Fix
   ○ ⏳ Waiting for CI
   ○ 🫠 Melting Brain
   ○ 🔄 Reverted Again
   ○ ⚠️ Commit and Pray
   ○ 🐛 Bug Fix... Maybe
   ○ 🤯 Mind-Blown
   ○ 🎶 Vibing
   ○ 🕵️ Debugging Detective
   ○ 🌙 Late Night Commit
   ○ 🙃 What Am I Doing?
   ○ 🧹 Cleaning Up
   ```
4. Your commit will be saved with the selected vibe.

### **Handling Staging**

If no files are staged, Commit Vibes will ask:

```
⚠️ No staged changes found!
Would you like to stage changes before committing?
✅ Yes, stage all changes
📂 Select specific files to stage
❌ No, cancel commit
```

## 🤝 Contributing

Pull requests are welcome! If you have cool ideas, **open an issue** or submit a PR. Let's make Git commit history more fun together!

## 📜 License

MIT License

---
