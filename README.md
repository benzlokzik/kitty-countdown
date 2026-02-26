# Kitty Countdown

Simple frontend-only website for counting down to a target datetime.

## Countdown target env var

Create `.env` from the example file:

```bash
cp .env.example .env
```

Then set the target datetime in `.env`:

```env
BUN_PUBLIC_COUNTDOWN_TARGET=2026-03-25T18:23:52+03:00
```

The UI reads this value and shows:
- hours
- minutes
- seconds
- milliseconds

If `bun dev` is already running, restart it after changing `.env`.

## Commands

Install dependencies:

```bash
bun install
```

Run dev server:

```bash
bun dev
```

Build:

```bash
bun run check
```

## Pre-commit

Install `pre-commit` (example with Homebrew):

```bash
brew install pre-commit
```

Install hooks in this repo:

```bash
pre-commit install
```

Run hooks manually anytime:

```bash
pre-commit run --all-files
```

The configured hook runs `bun run check` before each commit.
