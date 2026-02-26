import { useEffect, useMemo, useState } from "react";
import "./index.css";

const TARGET_ENV_NAME = "BUN_PUBLIC_COUNTDOWN_TARGET";
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

function parseTargetDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function readTargetEnv(): string | undefined {
  const fromImportMeta = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.BUN_PUBLIC_COUNTDOWN_TARGET;
  if (fromImportMeta) {
    return fromImportMeta;
  }

  if (typeof process !== "undefined") {
    return process.env.BUN_PUBLIC_COUNTDOWN_TARGET;
  }

  return undefined;
}

function splitDuration(totalMs: number): {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
} {
  const hours = Math.floor(totalMs / MS_PER_HOUR);
  const minutes = Math.floor((totalMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((totalMs % MS_PER_MINUTE) / MS_PER_SECOND);
  const milliseconds = Math.floor(totalMs % MS_PER_SECOND);

  return { hours, minutes, seconds, milliseconds };
}

function formatTargetDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function pad3(value: number): string {
  return String(value).padStart(3, "0");
}

type TargetConfig =
  | { kind: "missing" }
  | { kind: "invalid"; raw: string }
  | { kind: "ok"; raw: string; date: Date };

function resolveTargetConfig(raw: string | undefined): TargetConfig {
  if (!raw) {
    return { kind: "missing" };
  }

  const date = parseTargetDate(raw);
  if (!date) {
    return { kind: "invalid", raw };
  }

  return { kind: "ok", raw, date };
}

export function App() {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [targetConfig, setTargetConfig] = useState<TargetConfig>(() => resolveTargetConfig(readTargetEnv()));

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 16);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (targetConfig.kind !== "missing") {
      return;
    }

    let cancelled = false;
    const loadTargetFromApi = async () => {
      try {
        const response = await fetch("/api/countdown-target", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { target?: string | null };
        if (!cancelled) {
          setTargetConfig(resolveTargetConfig(data.target ?? undefined));
        }
      } catch {
        // Keep UI in "missing" state if no runtime config endpoint is available.
      }
    };

    void loadTargetFromApi();
    return () => {
      cancelled = true;
    };
  }, [targetConfig.kind]);

  const diffMs = targetConfig.kind === "ok" ? targetConfig.date.getTime() - nowMs : null;
  const isNegative = diffMs !== null && diffMs < 0;
  const formattedTime = useMemo(() => {
    if (diffMs === null) {
      return "--:--:--.---";
    }

    const { hours, minutes, seconds, milliseconds } = splitDuration(Math.abs(diffMs));
    const sign = diffMs < 0 ? "-" : "";
    return `${sign}${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad3(milliseconds)}`;
  }, [diffMs]);

  return (
    <main className="page">
      <span className="heart heart-a" aria-hidden />
      <span className="heart heart-b" aria-hidden />
      <span className="heart heart-c" aria-hidden />

      <section className="card">
        <p className="kitty-line">(=^.^=) kitty timer</p>
        <h1>Countdown</h1>

        <p className={`counter ${isNegative ? "counter-negative" : ""}`}>{formattedTime}</p>
        {targetConfig.kind === "ok" && (
          <>
            <p className="target-date">{formatTargetDate(targetConfig.date)}</p>
            <p className="timer-state">{diffMs !== null && diffMs >= 0 ? "left" : "ago"}</p>
            {isNegative && <p className="easter-egg">kitty time warp unlocked (=^-ω-^=)</p>}
          </>
        )}

        {targetConfig.kind === "missing" && (
          <p className="timer-state">
            Set <code>{TARGET_ENV_NAME}</code> on deploy.
          </p>
        )}

        {targetConfig.kind === "invalid" && (
          <p className="timer-state">
            Invalid <code>{TARGET_ENV_NAME}</code>: {targetConfig.raw}
          </p>
        )}

      </section>
    </main>
  );
}

export default App;
