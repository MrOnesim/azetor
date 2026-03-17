# azetor

A React + Vite starter project.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Package Manager**: pnpm
- **Language**: JavaScript (JSX)
- **Compiler**: React Compiler via babel-plugin-react-compiler

## Project Structure

```
├── src/
│   ├── App.jsx        # Main app component
│   ├── App.css        # App styles
│   ├── main.jsx       # Entry point
│   ├── index.css      # Global styles
│   └── assets/        # Images and SVGs
├── public/            # Static assets (favicon, icons)
├── index.html         # HTML entry point
├── vite.config.js     # Vite configuration
└── package.json       # Dependencies and scripts
```

## Development

```bash
pnpm install    # Install dependencies
pnpm run dev    # Start dev server on port 5000
pnpm run build  # Build for production (output: dist/)
```

## Replit Configuration

- Dev server runs on `0.0.0.0:5000` with `allowedHosts: true` for proxy compatibility
- Workflow: "Start application" runs `pnpm run dev`
- Deployment: Static site, build command `pnpm run build`, public dir `dist`
