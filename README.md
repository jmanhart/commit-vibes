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
commit-vibes "Refactored API calls"
```

You'll be prompted to pick a mood, and the commit will look something like:

```
Refactored API calls 😌 Feelin Confident
```

## Features

✅ **Choose a mood before committing** – Pick how you feel about the code\ (TODO)
✅ **Staging check** – Avoid committing when no files are staged\ (WIP)
✅ **Stage files easily** – Select individual files or stage everything\ (WIP)
✅ **Fun, expressive commit history** – Make Git logs more human\
✅ **(Coming Soon) Custom vibes** – Add your own custom moods!

## 🛠️ Usage

### **Making a Commit with Vibes**

1. Run:
   ```sh
   commit-vibes "Your commit message"
   ```
2. Select a **mood** from the list:
   ```
   How are you feeling about this commit?
   ✅ Feelin Confident 😌
   ❓ Feelin Uncertain 🤔
   🔥 Feelin Rushed 🔥
   ```
3. Your commit will be saved with the selected vibe.

### **Handling Staging**

If no files are staged, Commit Vibes will ask:

```
⚠️ No staged changes found!
Would you like to stage changes before committing?
✅ Yes, stage all changes
📂 Select specific files to stage
❌ No, cancel commit
```

## 🌟 Example Commit Messages

- `"Fixed a weird bug 😬 Feelin Nervous"`
- `"Major refactor 🚀 Feelin Rushed"`
- `"Added tests 🤞 Feelin Hopeful"`
- `"Hotfix for production 💀 Feelin Desperate"`

## 🎨 Roadmap

🔜 **Custom vibes** – Define your own moods\
🔜 **Integration with music-commit** – Combine mood + currently playing song\
🔜 **Emoji-only mode** – Keep it short with just the vibe emoji

## 🤝 Contributing

Pull requests are welcome! If you have cool ideas, **open an issue** or submit a PR. Let's make Git commit history more fun together!

## 📜 License

MIT License

---

💡 \*\*Commit histor
