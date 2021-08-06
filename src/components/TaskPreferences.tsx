import React from "react";
import { ETaskType, TTask } from "../types";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

export const TaskPreferences: React.FC<{
  value: TTask;
  onChange?: (task: any) => void;
  onDelete?: (task: any) => void;
}> = ({ value: task, onChange: updateTask, onDelete: deleteTask }) => {
  return (
    <div>
      <Select
        value={task.type}
        onChange={(v) => updateTask?.({ ...task, type: v })}
        label="type"
        options={[
          { value: ETaskType.SIMPLE, label: ETaskType.SIMPLE },
          { value: ETaskType.DECISION, label: ETaskType.DECISION },
        ]}
      ></Select>
      <Input
        value={task.taskReferenceName}
        onChange={(v) => updateTask?.({ ...task, taskReferenceName: v })}
        label="taskReferenceName"
      />
      <Input
        value={task.name}
        onChange={(v) => updateTask?.({ ...task, name: v })}
        label="name"
      />
      <button onClick={() => deleteTask?.(task)}>Delete task</button>
    </div>
  );
};
