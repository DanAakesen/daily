import { z } from "zod";
import type { TickTickItem } from "../domain/attention.js";
import { ExternalServiceError, fetchJson } from "../lib/http.js";

const API = "https://api.ticktick.com/open/v1";
const taskSchema = z.object({ id: z.string(), projectId: z.string().nullish(), title: z.string(), content: z.string().nullish(), startDate: z.string().nullish(), dueDate: z.string().nullish(), isAllDay: z.boolean().nullish(), priority: z.number().int().nullish(), status: z.number().int().nullish() }).passthrough();
const projectSchema = z.object({ id: z.string(), name: z.string() }).passthrough();
const habitSchema = z.object({ id: z.string(), name: z.string(), status: z.number().int().nullish(), goal: z.number().nullish(), repeatRule: z.string().nullish(), targetStartDate: z.number().int().nullish() }).passthrough();
const checkinSchema = z.object({ habitId: z.string(), checkins: z.array(z.object({ id: z.string().nullish(), stamp: z.number().int(), time: z.string().nullish(), value: z.number().nullish() }).passthrough()) }).passthrough();
const projectDataSchema = z.object({ tasks: z.array(taskSchema).default([]) }).passthrough();

const WORKOUTS = new Map([
  ["6a75ac6cbb03d10776b0775d", "gym" as const],
  ["6a75adfe8f08fd84160ae427", "run" as const],
]);

function headers(token: string): HeadersInit {
  return { authorization: `Bearer ${token}`, accept: "application/json", "content-type": "application/json" };
}

function toIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function dateStamp(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Copenhagen", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(`${values.year}${values.month}${values.day}`);
}

function stampIso(stamp: number): string {
  const text = String(stamp);
  return new Date(`${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}T00:00:00.000Z`).toISOString();
}

function weeklyTarget(habit: z.infer<typeof habitSchema>): number {
  const match = habit.repeatRule?.match(/(?:TT_TIMES|COUNT)=(\d+)/);
  return match?.[1] ? Number(match[1]) : Math.max(1, Math.round(habit.goal ?? 1));
}

export async function fetchTickTick(token: string | undefined, now: Date): Promise<TickTickItem[]> {
  if (!token) throw new ExternalServiceError("ticktick_not_configured", "TickTick OAuth is not configured");
  const openTasks = await fetchJson(`${API}/task/filter`, { method: "POST", headers: headers(token), body: JSON.stringify({ status: [0] }) }, z.array(taskSchema), "ticktick");
  const projects = await fetchJson(`${API}/project`, { method: "GET", headers: headers(token) }, z.array(projectSchema), "ticktick");
  const projectData = await Promise.all(projects.map((project) => fetchJson(`${API}/project/${encodeURIComponent(project.id)}/data`, { method: "GET", headers: headers(token) }, projectDataSchema, "ticktick")));
  const taskById = new Map([...openTasks, ...projectData.flatMap((data) => data.tasks)].map((task) => [task.id, task]));
  const habits = await fetchJson(`${API}/habit`, { method: "GET", headers: headers(token) }, z.array(habitSchema), "ticktick");
  const activeHabits = habits.filter((habit) => (habit.status ?? 0) === 0);
  const from = dateStamp(new Date(now.getTime() - 30 * 86_400_000));
  const to = dateStamp(now);
  const checkins = activeHabits.length
    ? await fetchJson(`${API}/habit/checkins?habitIds=${encodeURIComponent(activeHabits.map((habit) => habit.id).join(","))}&from=${from}&to=${to}`, { method: "GET", headers: headers(token) }, z.array(checkinSchema), "ticktick")
    : [];

  const tasks: TickTickItem[] = [...taskById.values()].map((task) => ({ type: "task", id: task.id, title: task.title, projectId: task.projectId ?? null, priority: task.priority ?? 0, dueAt: toIso(task.dueDate), startAt: toIso(task.startDate), allDay: task.isAllDay ?? false, status: task.status === 2 ? "completed" : "open", content: task.content?.slice(0, 4000) ?? null }));
  const habitItems: TickTickItem[] = activeHabits.map((habit) => ({ type: "habit", id: habit.id, title: habit.name, active: true, target: Math.max(1, Math.round(habit.goal ?? 1)), repeatRule: habit.repeatRule ?? null, startDate: habit.targetStartDate ? String(habit.targetStartDate) : null }));
  const checkinItems: TickTickItem[] = checkins.flatMap((document) => document.checkins.map((checkin, index) => ({ type: "habit_checkin" as const, id: checkin.id ?? `${document.habitId}:${checkin.stamp}:${index}`, title: `${activeHabits.find((habit) => habit.id === document.habitId)?.name ?? "Habit"} check-in`, habitId: document.habitId, checkinAt: toIso(checkin.time) ?? stampIso(checkin.stamp), value: checkin.value ?? 1 })));
  const targets: TickTickItem[] = activeHabits.flatMap((habit) => {
    const workoutClass = WORKOUTS.get(habit.id);
    return workoutClass ? [{ type: "workout_target" as const, id: habit.id, title: habit.name, habitId: habit.id, active: true, target: weeklyTarget(habit), repeatRule: habit.repeatRule ?? null, startDate: habit.targetStartDate ? String(habit.targetStartDate) : null, workoutClass }] : [];
  });
  return [...tasks, ...habitItems, ...checkinItems, ...targets];
}
