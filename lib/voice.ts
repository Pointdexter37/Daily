import * as Speech from "expo-speech";
import { Task } from "./types";

export function speakTasks(tasks: string[] | Task[]) {
  const text = tasks
    .map((task) => (typeof task === "string" ? task : task.title))
    .filter(Boolean)
    .map((title, index) => `${index + 1}. ${title}`)
    .join(". ");

  if (!text) {
    return;
  }

  Speech.stop();
  Speech.speak(text, {
    rate: 0.96,
    pitch: 1.0,
    language: "en-US"
  });
}
