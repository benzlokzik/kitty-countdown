# Kitty Countdown

Simple frontend-only website for counting down to a target datetime.

<img width="2538" height="1772" alt="screenshot" src="https://github.com/user-attachments/assets/7cb6588d-cb6a-427a-8258-28292468a352" />

## Countdown target env var

Create `.env` from the example file:

```bash
cp .env.example .env
```

Then set the target datetime in `.env`:

```env
BUN_PUBLIC_COUNTDOWN_TARGET=2026-03-25T18:23:52+03:00
```

The static frontend reads this value at build time and shows:
- hours
- minutes
- seconds
- milliseconds

After changing `.env`, restart `bun dev` or run `bun run build` again.
For static hosting, `.env` is not read at runtime from `dist`; values are baked in during build.

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
