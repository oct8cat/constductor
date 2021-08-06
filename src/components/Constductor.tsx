import React, { useState, useMemo } from "react";
import ReactFlow, { Elements, Controls } from "react-flow-renderer";
import { TTask } from "../types";
import { tasksToElements, updateTasks, findTask, deleteTask } from "../util";
import { TaskPreferences } from "./TaskPreferences";

export const Constductor: React.FC<{
  value: TTask[];
  onChange: (value: TTask[]) => void;
}> = ({ value: tasks, onChange: setTasks }) => {
  const [activeElements, setActiveElements] = useState<Elements | null>(null);
  const selectedElement = activeElements && activeElements[0];
  const selectedTask = useMemo(
    () => selectedElement && findTask(selectedElement.data.task.id, tasks),
    [selectedElement, tasks]
  );
  const setTask = (task: TTask) => setTasks(updateTasks(task, tasks));

  return (
    <div style={{ display: "flex" }}>
      <ReactFlow
        elements={tasksToElements(tasks, { x: 500, y: 10 })}
        style={{ height: 900, border: "solid 1px red" }}
        onSelectionChange={setActiveElements}
      >
        {selectedTask && (
          <Controls
            showFitView={false}
            showInteractive={false}
            showZoom={false}
          >
            <TaskPreferences
              value={selectedTask}
              onChange={setTask}
              onDelete={(task) => {
                setTasks(deleteTask(task, tasks));
              }}
            />
          </Controls>
        )}
      </ReactFlow>
    </div>
  );
};
