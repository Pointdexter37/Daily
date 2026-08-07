import { addDays } from "./date";
import { DayRecord, PreviewState, PreviewTask, Priority } from "./types";

const priorityScore: Record<Priority, number> = {
  low: 1,
  normal: 2,
  high: 3
};

export function completionRateForDay(tasks: DayRecord["tasks"]) {
  if (tasks.length === 0) {
    return 0;
  }
  const done = tasks.filter((task) => task.done).length;
  return done / tasks.length;
}

function priorityReason(priority: Priority) {
  if (priority === "high") return "Kept at the front because it was marked high priority.";
  if (priority === "low") return "Placed lower because it is lower priority.";
  return "Kept near the top as a normal priority carry-over.";
}

export function buildTomorrowPreview(today: DayRecord, history: DayRecord[]): PreviewState {
  const targetDate = addDays(today.date, 1);
  const undone = today.tasks.filter((task) => !task.done);
  const recentAverage =
    history.length === 0 ? 0 : history.reduce((sum, record) => sum + record.completionRate, 0) / history.length;

  const tasks: PreviewTask[] = undone
    .map((task, index) => ({
      id: `${task.id}-preview-${index}`,
      title: task.title,
      priority: task.priority,
      carriedOverFrom: task.carriedOverFrom ?? today.date,
      reason: [
        `Carried from ${today.date}.`,
        priorityReason(task.priority),
        recentAverage < 0.5 ? "Past few days have had lower completion, so it stays visible." : "History looks healthy, so the planner keeps a steady order."
      ].join(" ")
    }))
    .sort((left, right) => {
      const scoreLeft = priorityScore[left.priority];
      const scoreRight = priorityScore[right.priority];
      if (scoreLeft !== scoreRight) {
        return scoreRight - scoreLeft;
      }
      return left.title.localeCompare(right.title);
    });

  return {
    sourceDate: today.date,
    targetDate,
    tasks,
    generatedAt: new Date().toISOString()
  };
}
