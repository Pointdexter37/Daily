export type Priority = "low" | "normal" | "high";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  carriedOverFrom?: string;
  createdAt: string;
};

export type DayRecord = {
  date: string;
  tasks: Task[];
  completionRate: number;
  closedAt: string | null;
};

export type PreviewTask = {
  id: string;
  title: string;
  reason: string;
  priority: Priority;
  carriedOverFrom?: string;
};

export type PreviewState = {
  sourceDate: string;
  targetDate: string;
  tasks: PreviewTask[];
  generatedAt: string;
};

export type AppSettings = {
  voiceEnabled: boolean;
  reminderTime: string;
};

export type AppState = {
  days: Record<string, DayRecord>;
  preview: PreviewState | null;
  settings: AppSettings;
};
