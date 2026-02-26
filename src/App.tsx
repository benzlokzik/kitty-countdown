import { useEffect, useMemo, useState } from "react";
import "./index.css";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toInputDateValue(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

function parseInputDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getCalendarDayDifference(from: Date, to: Date): number {
  const fromUTC = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUTC = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUTC - fromUTC) / MS_PER_DAY);
}

function formatTargetDate(date: Date | null): string {
  if (!date) {
    return "Choose a date";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(date);
}

export function App() {
  const [targetValue, setTargetValue] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return toInputDateValue(defaultDate);
  });
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const targetDate = useMemo(() => parseInputDate(targetValue), [targetValue]);
  const dayDiff = targetDate ? getCalendarDayDifference(now, targetDate) : null;
  const dayText =
    dayDiff === null
      ? "No countdown yet"
      : dayDiff === 0
        ? "It is today"
        : dayDiff > 0
          ? `${dayDiff} day${dayDiff === 1 ? "" : "s"} left`
          : `${Math.abs(dayDiff)} day${Math.abs(dayDiff) === 1 ? "" : "s"} ago`;

  return (
    <main className="page">
      <span className="heart heart-a" aria-hidden />
      <span className="heart heart-b" aria-hidden />
      <span className="heart heart-c" aria-hidden />

      <section className="card">
        <p className="kitty-line">(=^.^=) kitty countdown</p>
        <h1>Days Until</h1>

        <label htmlFor="target-date">Target date</label>
        <input
          id="target-date"
          type="date"
          value={targetValue}
          onChange={event => setTargetValue(event.target.value)}
        />

        <p className="counter">{dayText}</p>
        <p className="target-date">{formatTargetDate(targetDate)}</p>
      </section>
    </main>
  );
}

export default App;
