import type { Task } from "@/types/task";

const DEFAULT_DURATION_MINUTES = 30;

function noonToday(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

function getEventStart(task: Task): Date {
  const dueStr = task.kind === "once" ? task.dueAt : task.nextDueAt;
  if (dueStr) {
    const due = new Date(dueStr);
    if (due > new Date()) return due;
  }
  return noonToday();
}

function toIsoBasic(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl(task: Task): string {
  const start = getEventStart(task);
  const durationMs = (task.estimatedMinutes ?? DEFAULT_DURATION_MINUTES) * 60_000;
  const end = new Date(start.getTime() + durationMs);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: task.title,
    dates: `${toIsoBasic(start)}/${toIsoBasic(end)}`,
  });
  if (task.notes) params.set("details", task.notes);
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function buildIcsContent(task: Task): string {
  const start = getEventStart(task);
  const durationMs = (task.estimatedMinutes ?? DEFAULT_DURATION_MINUTES) * 60_000;
  const end = new Date(start.getTime() + durationMs);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TaskCycle//TaskCycle//EN",
    "BEGIN:VEVENT",
    `UID:${task.id}@taskcycle`,
    `DTSTAMP:${toIsoBasic(new Date())}`,
    `DTSTART:${toIsoBasic(start)}`,
    `DTEND:${toIsoBasic(end)}`,
    `SUMMARY:${task.title}`,
  ];
  if (task.notes) lines.push(`DESCRIPTION:${task.notes}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(task: Task): void {
  const blob = new Blob([buildIcsContent(task)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${task.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
