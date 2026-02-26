# Kitty Countdown

Simple frontend-only website for counting days until a date.

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
