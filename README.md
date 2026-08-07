# DailyFlow — Adaptive To-Do App

A daily to-do mobile app that rearranges tomorrow's task list based on how much
you actually got done today, with voice input (speak to add tasks) and voice
output (have it read your list back to you).

---

## Core Idea

1. You add tasks for today (typed or spoken).
2. At day's end, you close out the day — done vs skipped tasks get recorded.
3. An AI call looks at today's results + recent history and generates
   tomorrow's suggested order (carried-over tasks get bumped up or flagged,
   new tasks slot in).
4. You can have the app read the list aloud at any point.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| App framework | **React Native + Expo** | One codebase for iOS + Android, fast to build/test, huge ecosystem |
| AI brain | **Google Gemini API (free tier)** | Free quota is generous for a single-user daily call; good at structured JSON output for "reorder this list" tasks |
| Database | **Firebase Firestore (free Spark plan)** | Free tier, syncs across devices automatically, easy auth pairing |
| Auth | **Firebase Auth (free)** | Simple email or anonymous sign-in so your data follows you across devices |
| Voice input | **expo-speech-recognition** (or `@react-native-voice/voice`) | On-device speech-to-text, no extra API cost |
| Voice output | **expo-speech** | Built-in text-to-speech, no extra API cost |
| Hosting/build | **Expo EAS (free tier)** | Build and ship the app without owning native build infra |

**Total recurring cost at your scale (single user, daily use): $0/month.**
Gemini's free tier and Firebase's free tier both comfortably cover one
person making a handful of AI calls and small DB writes per day.

---

## Data Model (Firestore)

```
users/{userId}
  └── days/{date}                # e.g. "2026-08-07"
        ├── tasks: [
        │     { id, title, done, carriedOverFrom, priority }
        │   ]
        ├── completionRate: number
        └── closedAt: timestamp
```

Keeping each day as its own document makes it cheap to pull "last 7 days"
for the AI prompt without scanning a huge collection.

---

## AI Rearrangement Flow

1. On "close day", app bundles:
   - Today's tasks (done/skipped)
   - Age of any carried-over tasks
   - Completion rate of last ~7 days
2. Sends this as a prompt to Gemini asking for a JSON array back:
   `tomorrow's tasks, ordered, with a short reason per reorder`
3. App parses the JSON and shows it as a **Tomorrow Preview** before it
   becomes the live list — you can edit before accepting.

Keeping the prompt small (just structured stats, not full history) keeps
each call well within Gemini's free-tier limits.

---

## Voice Features

- **Input:** mic button next to "add task" → on-device speech-to-text →
  transcript shown for you to confirm/edit → added as a task.
- **Output:** speaker button on Today list or Tomorrow Preview → reads
  tasks aloud via on-device text-to-speech. No API cost either direction.

---

## Screens

- **Today** — active list, checkboxes, add task (type or speak), close-day button
- **Tomorrow Preview** — AI-suggested order + reasons, editable before accepting
- **History** — simple streak / completion-rate view over past days
- **Settings** — auth, voice on/off, notification time for daily close-out

---

## Open Decisions (fill in before building)

- [ ] Auto-run the AI reorder on close-day, or only when you tap "Plan Tomorrow"?
- [ ] Should tasks unfinished for N days auto-drop, or always stay flagged for you to decide?
- [ ] Daily reminder notification to close out the day?

---

## Rough Build Order

1. Expo app shell + Firebase project setup (auth + Firestore)
2. Today screen: add/complete/delete tasks, typed input
3. Close-day flow + history writes to Firestore
4. Gemini integration for Tomorrow Preview
5. Voice input (expo-speech-recognition)
6. Voice output (expo-speech)
7. History screen + polish
