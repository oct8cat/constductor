import React from "react";
import { ETaskType, TTask } from "../types";
import { Input } from "./ui/Input";
import { Parameters } from "./ui/Parameters";
import { Select } from "./ui/Select";

export const TaskPreferences: React.FC<{
  value: TTask;
  onChange?: (task: any) => void;
  onDelete?: (task: any) => void;
}> = ({ value: task, onChange: updateTask, onDelete: deleteTask }) => {
  return (
    <div>
      <h3>Properties</h3>
      <Select
        value={task.type}
        onChange={(v) => updateTask?.({ ...task, type: v })}
        label="type"
        options={taskTypeOptions}
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
      {task.type === ETaskType.DECISION && (
        <Input
          value={task.caseValueParam}
          onChange={(v) => updateTask?.({ ...task, caseValueParam: v })}
          label="caseValueParam"
        />
      )}
      <Parameters
        value={task.inputParameters || {}}
        onChange={(v) => updateTask?.({ ...task, inputParameters: v })}
        label="Input parameters"
      />

      <h3>Actions</h3>
      <button onClick={() => deleteTask?.(task)}>Delete task</button>
    </div>
  );
};

const taskTypeOptions = [
  { value: ETaskType.SIMPLE, label: ETaskType.SIMPLE },
  { value: ETaskType.WAIT, label: ETaskType.WAIT },
  { value: ETaskType.DECISION, label: ETaskType.DECISION },
];
