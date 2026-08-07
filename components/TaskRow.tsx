import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Task } from "../lib/types";

type TaskRowProps = {
  task: Task;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
};

export function TaskRow({ task, index, onToggle, onDelete, onRename }: TaskRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  return (
    <View style={[styles.row, task.done && styles.rowDone]}>
      <TouchableOpacity style={[styles.checkbox, task.done && styles.checkboxDone]} onPress={onToggle}>
        <Ionicons name={task.done ? "checkmark" : "ellipse-outline"} size={18} color={task.done ? "#081120" : "#e2e8f0"} />
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={styles.index}>#{index + 1}</Text>
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            style={styles.input}
            onSubmitEditing={() => {
              onRename(draft.trim());
              setEditing(false);
            }}
            onBlur={() => {
              if (draft.trim() && draft.trim() !== task.title) {
                onRename(draft.trim());
              } else {
                setDraft(task.title);
              }
              setEditing(false);
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => setEditing(true)}
            onLongPress={() =>
              Alert.alert("Task actions", task.title, [
                { text: "Rename", onPress: () => setEditing(true) },
                { text: "Delete", style: "destructive", onPress: onDelete },
                { text: "Cancel", style: "cancel" }
              ])
            }
          >
            <Text style={[styles.title, task.done && styles.titleDone]}>{task.title}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.meta}>
          Priority: {task.priority}
          {task.carriedOverFrom ? ` · carried from ${task.carriedOverFrom}` : ""}
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={18} color="#fca5a5" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 20,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#24324f",
    padding: 12
  },
  rowDone: {
    opacity: 0.82
  },
  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#24324f",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  checkboxDone: {
    backgroundColor: "#86efac",
    borderColor: "#86efac"
  },
  body: {
    flex: 1,
    gap: 4
  },
  index: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700"
  },
  input: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0
  },
  title: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700"
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#94a3b8"
  },
  meta: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#101a2d",
    alignItems: "center",
    justifyContent: "center"
  }
});
