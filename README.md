# Chat Demo

A simple chat demo using `useChat` from `@ai-sdk/react` to demonstrate AI-powered chat functionality.

## Features

- Real-time streaming responses
- Auto-scroll to latest messages
- Status indicators (streaming, sending, error, ready)
- Suggestion buttons for quick start
- Stop button to abort streaming
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Development

```bash
# Install dependencies
pnpm install

# Start development server (port 3002)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## API Endpoint

The chat demo expects a backend endpoint at `/api/chat` that handles streaming chat responses. In development, requests are proxied to `http://localhost:3000` via Vite's proxy configuration.

## Tech Stack

- React 18
- TypeScript
- Vite
- `@ai-sdk/react` for chat functionality
