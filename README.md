# beatMe

A multiplayer music game where friends challenge each other with beats, riffs, and solos.

## Game Modes

- **Guess the Song** — Record a few notes from a song. Your friend has to guess what it is!
- **Complete the Riff** — Send a guitar riff with missing notes. Can your friend fill in the gaps?
- **Continue the Beat** — Start a drum pattern. Your friend continues where you left off!

## Tech Stack

- **Backend:** NestJS + TypeORM + SQLite + Socket.IO
- **Frontend:** React + TypeScript + Tone.js (Web Audio)
- **Real-time:** WebSocket gateway for live note sharing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd server
npm install
npm run start:dev
```

Server runs on `http://localhost:3001/api`

### Frontend

```bash
cd client
npm install
npm start
```

App runs on `http://localhost:3000`

## Project Structure

```
beatMe/
├── server/                  # NestJS backend
│   └── src/
│       ├── player/          # Player entity & CRUD
│       ├── challenge/       # Challenge entity, scoring, CRUD
│       └── game/            # WebSocket gateway for real-time play
├── client/                  # React frontend
│   └── src/
│       ├── components/      # BeatPad, SequenceVisualizer
│       ├── pages/           # Home, Dashboard, Create, Play
│       ├── services/        # API client, Socket, Audio engine
│       └── types/           # Shared TypeScript types
└── README.md
```
