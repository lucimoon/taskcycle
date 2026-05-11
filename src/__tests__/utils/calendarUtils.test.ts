import { vi, describe, it, expect, afterEach } from "vitest";
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
} from "@/utils/calendarUtils";
import type { Task } from "@/types/task";

function makeTask(overrides: Partial<Task> & { kind?: "once" | "cyclic" } = {}): Task {
  const kind = overrides.kind ?? "once";
  const base = {
    id: "task-abc",
    title: "Buy groceries",
    steps: [],
    priority: 2 as const,
    urgency: 2 as const,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  if (kind === "cyclic") {
    return { ...base, kind: "cyclic", recurAfterMinutes: 60, ...overrides } as Task;
  }
  return { ...base, kind: "once", ...overrides } as Task;
}

afterEach(() => vi.useRealTimers());

describe("buildGoogleCalendarUrl", () => {
  it("uses dueAt as the start time", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z", estimatedMinutes: 60 });
    const url = buildGoogleCalendarUrl(task);
    expect(url).toContain("20260601T090000Z");
  });

  it("sets end time based on estimatedMinutes", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z", estimatedMinutes: 60 });
    const url = buildGoogleCalendarUrl(task);
    expect(url).toContain("20260601T100000Z");
  });

  it("defaults to 30 min duration when estimatedMinutes is absent", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const url = buildGoogleCalendarUrl(task);
    // 09:00 + 30min = 09:30
    expect(url).toContain("20260601T093000Z");
  });

  it("includes task title as text param", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const url = buildGoogleCalendarUrl(task);
    expect(url).toContain("text=Buy+groceries");
  });

  it("includes notes as details param when set", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z", notes: "Bring bags" });
    const url = buildGoogleCalendarUrl(task);
    expect(url).toContain("details=Bring+bags");
  });

  it("omits details param when notes is absent", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const url = buildGoogleCalendarUrl(task);
    expect(url).not.toContain("details=");
  });

  it("uses nextDueAt for cyclic tasks", () => {
    const task = makeTask({
      kind: "cyclic",
      nextDueAt: "2026-07-15T08:00:00.000Z",
      estimatedMinutes: 45,
    });
    const url = buildGoogleCalendarUrl(task);
    expect(url).toContain("20260715T080000Z");
    expect(url).toContain("20260715T084500Z");
  });

  it("defaults start to noon today when no due date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-11T00:00:00.000Z"));
    const task = makeTask();
    const url = buildGoogleCalendarUrl(task);
    // Compute expected noon the same way the implementation does (local noon → UTC)
    const expectedNoon = new Date("2026-05-11T00:00:00.000Z");
    expectedNoon.setHours(12, 0, 0, 0);
    const expectedStr = expectedNoon
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    expect(url).toContain(expectedStr);
    expect(url).toContain("action=TEMPLATE");
  });

  it("defaults start to noon today when due date is in the past", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-11T00:00:00.000Z"));
    const task = makeTask({ dueAt: "2026-01-01T09:00:00.000Z" });
    const url = buildGoogleCalendarUrl(task);
    expect(url).not.toContain("20260101T");
    const expectedNoon = new Date("2026-05-11T00:00:00.000Z");
    expectedNoon.setHours(12, 0, 0, 0);
    const expectedStr = expectedNoon
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    expect(url).toContain(expectedStr);
  });
});

describe("buildIcsContent", () => {
  it("contains required ICS structure", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("uses task id in UID", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("UID:task-abc@taskcycle");
  });

  it("sets DTSTART from dueAt", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("DTSTART:20260601T090000Z");
  });

  it("sets DTEND using estimatedMinutes", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z", estimatedMinutes: 90 });
    const ics = buildIcsContent(task);
    expect(ics).toContain("DTEND:20260601T103000Z");
  });

  it("defaults to 30 min duration when estimatedMinutes is absent", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("DTEND:20260601T093000Z");
  });

  it("includes SUMMARY with task title", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("SUMMARY:Buy groceries");
  });

  it("includes DESCRIPTION when notes are set", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z", notes: "Don't forget milk" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("DESCRIPTION:Don't forget milk");
  });

  it("omits DESCRIPTION when notes are absent", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).not.toContain("DESCRIPTION:");
  });

  it("uses CRLF line endings", () => {
    const task = makeTask({ dueAt: "2026-06-01T09:00:00.000Z" });
    const ics = buildIcsContent(task);
    expect(ics).toContain("BEGIN:VCALENDAR\r\nVERSION:2.0");
  });
});
