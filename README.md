# Intervue - Real-time Polling App

A React-based real-time polling application with cross-tab synchronization and atomic vote processing.

## Features

- ✅ Real-time poll delivery and results
- ✅ Cross-tab synchronization using BroadcastChannel
- ✅ Atomic vote processing with cross-tab locking
- ✅ Race condition protection
- ✅ Student and teacher interfaces
- ✅ Mobile-responsive design with Chakra UI

## Deployment

This app is ready for deployment on:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Import from GitHub
- **GitHub Pages**: Automatic deployment via GitHub Actions

## Local Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

## Tech Stack

- React 18
- Vite
- Chakra UI
- React Router DOM
- LocalStorage for persistence
- BroadcastChannel for real-time sync
