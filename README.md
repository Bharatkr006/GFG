# CodeArena — Weekly Assessment 10 (GeeksforGeeks Contest Clone)

A high-performance, polished competitive programming contest interface inspired by the GeeksforGeeks Practice Contest platform, built with React, Vite, TypeScript, Tailwind CSS, and Monaco Editor. **Vercel-ready with zero external backend requirement.**

![CodeArena Contest Overview](https://img.shields.io/badge/CodeArena-Weekly%20Assessment%2010-16A34A?style=for-the-badge)
![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20Ready-000000?style=for-the-badge&logo=vercel)

---

## 🚀 Key Features

### 1. Dual-Panel Resizable Contest Workspace
- **Draggable Vertical Divider**: Smooth percentage-based split panel resizing with mouse and touch support.
- **Independent Scrolling**: Left and right panels scroll independently with high information density.
- **Responsive Stacked Layout**: Automatically transforms to mobile-friendly tabs on smaller screens.
- **Fullscreen Editor Mode**: Focus entirely on code editing with a single click.

### 2. Rich Problem Interface
- **Default Problem**: *"Smallest Subset with Greater Sum"* with accuracy (90%), submissions (100+), points (+10), and constraints.
- **Additional Problems**:
  - *"Maximum Subarray Sum"* (Medium, Kadane's algorithm)
  - *"Two Sum - Pair with Given Sum"* (Easy)
- **Interactive Examples**: Formatted Input, Output, and Explanation cards.
- **"Try More Examples"**: Seamlessly reveals hidden test cases and walkthroughs.
- **Problem Tools**: Bookmark toggle with persistence, report problem modal, previous/next problem navigation.

### 3. Professional Monaco Code Editor
- **Multi-Language Support**: C++17, C++20, Python 3, Java, and JavaScript.
- **Language-Specific Boilerplates**: Default templates match competitive programming input/output formats (`cin`/`cout`, `sys.stdin.read`, `Scanner`, etc.).
- **Local Storage Drafts**: Automatically preserves code drafts per problem and language between refreshes.
- **Editor Controls**: Font size adjustments, code reset, clipboard copy with feedback, file download, theme toggle (vs-dark/light), and fallback mode.

### 4. Code Execution Adapter & Test Runner
- **Remote Execution**: Browser-direct connection to public Piston execution runner (`https://emkc.org/api/v2/piston/execute`) without API keys.
- **JavaScript Web Worker Fallback**: Sandboxed, timeout-protected Web Worker runner for offline or fallback JS execution.
- **Custom Input**: Expandable modal to provide custom stdin test cases.
- **Execution Drawer**: Slide-up console displaying:
  - Verdict summary (`Accepted`, `Wrong Answer`, `Compilation Error`, `Runtime Error`, `Execution Unavailable`).
  - Output stdout, stderr, execution duration (ms), and exit codes.
  - Test case comparison tabs (Input, Expected Output, Your Output).

### 5. Contest Timer & State
- **2-Hour Countdown**: Persisted deadline in `LocalStorage` (`HH:MM:SS`).
- **Urgency Warning**: Automatic amber pulse warning when less than 10 minutes remain.
- **Contest Finish Flow**: Confirmation dialog displaying remaining time and submission count before ending.

### 6. Submissions & Contest Home Pages
- **Contest Home** (`/contest-home`): Assessment overview, guidelines, scoring, and problem completion badges.
- **Submissions Page** (`/submissions`): Searchable table of submission history with verdict filters, timestamps, runtime, and code viewer modal.
- **SPA Rewrites**: `vercel.json` configured so refreshing any route works seamlessly.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **Editor**: `@monaco-editor/react`
- **Icons**: `lucide-react`
- **Storage**: Browser `localStorage` API

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` (or the indicated port) in your browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## 🌐 Deploy to Vercel

This repository is pre-configured for **one-click Vercel deployment**:

1. Push this repository to GitHub or GitLab.
2. In Vercel, click **"Add New Project"** and select this repository.
3. Keep default settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

The included `vercel.json` ensures that all SPA routes (`/`, `/problems/:id`, `/submissions`, `/contest-home`) route directly to `index.html`.
