# Learning Assistant Chrome Extension

An ethical productivity tool for Coursera and LinkedIn Learning that helps learners study more effectively through smart playback controls, transcript-driven notes, practice quizzes, and intelligent study planning.

## ✨ Features

### 🎯 Core Learning Tools
- **Smart Video Controls**: Hotkey-driven playback (Alt+P, Alt+←, Alt+→)
- **Time-Verified Progress**: Tracks actual watch time with completion detection
- **Transcript Notes**: Click-to-seek transcripts with timestamped note-taking (Ctrl+M)
- **Practice Quizzes**: Auto-generated MCQs from watched content
- **Study Planner**: CSV-based scheduling with Chrome notifications

### 📊 Analytics & Insights
- **Progress Tracking**: Detailed learning analytics and time tracking
- **Study Statistics**: Course completion rates and learning patterns
- **Export/Import**: Backup and restore all learning data

### 🎨 Modern UI
- **AlgoPlug-Inspired Design**: Futuristic glassmorphism interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for extended study sessions

## 🛡️ Ethics & Compliance

**This extension is designed for ethical use only:**
- ✅ Helps you study more effectively
- ✅ Tracks your actual learning progress
- ✅ Generates practice materials
- ❌ Does NOT automate course completion
- ❌ Does NOT submit assignments or quizzes
- ❌ Does NOT bypass platform requirements

## 🚀 Installation

### Development Setup
1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

### Usage
1. Visit a Coursera or LinkedIn Learning course page
2. Click the extension icon to open the popup dashboard
3. Use hotkeys for video control or access the study panel
4. Take notes with Ctrl+M while watching lectures
5. Upload a CSV study plan in Settings for automated scheduling

## 📁 CSV Study Plan Format

Create a CSV file with these columns:
```csv
course,title,est_minutes,deadline
"Machine Learning","Introduction to ML",45,"2025-02-15"
"Web Development","HTML Basics",30,"2025-02-10"
```

## 🎮 Hotkeys

- **Alt + P**: Play/Pause video
- **Alt + →**: Seek forward 10 seconds  
- **Alt + ←**: Seek backward 10 seconds
- **Ctrl + M**: Add timestamped note

## 🔧 Settings

Customize your experience in the Options page:
- Adjust completion threshold (90-98%)
- Set daily study time budget
- Configure session lengths
- Export/import learning data

## 🎯 Supported Platforms

- ✅ Coursera (coursera.org)
- ✅ LinkedIn Learning (linkedin.com/learning)

## 📊 Data Privacy

All data is stored locally in your browser using Chrome's storage API. No data is sent to external servers unless you explicitly export it.

## 🆘 Troubleshooting

**Extension not working?**
- Ensure you're on a supported site (Coursera/LinkedIn Learning)
- Check that the page has fully loaded
- Try refreshing the page

**Video controls not responding?**
- Make sure the video player is visible and loaded
- Check that hotkeys aren't conflicting with site shortcuts

**Notes not saving?**
- Verify you have storage permissions enabled
- Check Chrome's storage quota in Developer Tools

## 👨‍💻 Development

Built with:
- Manifest V3 Chrome Extension APIs
- Vanilla JavaScript (no frameworks)
- TailwindCSS-inspired styling
- Chart.js for analytics visualization

## 📄 License & Copyright

© 2025 Sugam Kaistha | [Portfolio](https://sugam-portfolio-cv.vercel.app/)

This project is for educational and productivity purposes. Use responsibly and in accordance with your learning platform's terms of service.

---

**Happy Learning! 🎓**