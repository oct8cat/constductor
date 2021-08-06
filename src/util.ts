import { Edge, Elements, isNode, Node, XYPosition } from "react-flow-renderer";
import { TTask, ETaskType } from "./types";
import { v4 as createId } from "uuid";

export const findLastTaskNode = (nodes: Node[]) => {
  return nodes.reduce(
    (acc, node) => (acc.position.y > node.position.y ? acc : node),
    nodes[0]
  );
};

export const createInputNode = (position: XYPosition) => ({
  id: "input",
  type: "input",
  data: { label: "input" },
  position,
});

export const createOutputNode = (position: XYPosition) => ({
  id: "output",
  type: "output",
  data: { label: "output" },
  position,
});

export const addVirtualTasks = (tasks: TTask[]): TTask[] => [
  {
    type: ETaskType.BEGIN,
    id: "begin",
    taskReferenceName: "begin",
    name: "begin",
  },
  ...tasks,
  {
    type: ETaskType.END,
    id: "end",
    taskReferenceName: "end",
    name: "end",
  },
];

export const tasksToElements = (
  tasks: TTask[],
  position: XYPosition
): Elements => {
  tasks = addVirtualTasks(tasks);
  const tasksNodes = tasksToNodes(tasks, position);
  const tasksEdges = tasksToEdges(tasks);
  const tasksElements = [...tasksNodes, ...tasksEdges];
  return tasksElements;
};

export const tasksToNodes = (tasks: TTask[], position: XYPosition): Node[] => {
  return tasks.reduce<Node[]>((acc, task, index) => {
    const nodes = acc.filter(isNode);
    const y = !nodes.length
      ? position.y
      : findLastTaskNode(nodes).position.y + 100;
    return acc.concat(taskToNodes(task, { ...position, y }));
  }, []);
};

export const getOutputIds = (task: TTask): string[] => {
  if (task.type == ETaskType.DECISION) {
    return Object.keys(task.decisionCases).reduce<string[]>((acc, key) => {
      const caseTasks = task.decisionCases[key];
      return acc.concat(getOutputIds(caseTasks[caseTasks.length - 1]));
    }, []);
  }
  return [task.id];
};

export const tasksToEdges = (tasks: TTask[]): Edge[] => {
  return tasks.reduce<Edge[]>((acc, task, taskIndex) => {
    const prevTask = tasks[taskIndex - 1];
    if (!prevTask) {
      return acc;
    }
    const inputEdges = getOutputIds(prevTask).map((inputId) =>
      createEdge(
        inputId,
        task.id,
        `${prevTask.taskReferenceName}:${task.taskReferenceName}`
      )
    );
    if (task.type === ETaskType.DECISION) {
      const casesKeys = Object.keys(task.decisionCases);
      const casesEdges = casesKeys.reduce<Edge[]>((acc, caseKey) => {
        const caseTasks = task.decisionCases[caseKey];
        const caseInputEdge = createEdge(task.id, caseTasks[0].id, caseKey);
        const caseTasksEdges = tasksToEdges(caseTasks);
        return acc.concat(caseInputEdge, caseTasksEdges);
      }, []);
      return acc.concat(inputEdges, casesEdges);
    }
    return acc.concat(inputEdges);
  }, []);
};

export const createEdge = (
  sourceId: string,
  targetId: string,
  label: string = `${sourceId}:${targetId}`
): Edge => ({
  id: `${sourceId}:${targetId}`,
  source: sourceId,
  target: targetId,
  label: label,
});

export const taskToNodeType = (task: TTask): string => {
  switch (task.type) {
    case ETaskType.BEGIN:
      return "input";
    case ETaskType.END:
      return "output";
    default:
      return task.type;
  }
};

export const taskToNodes = (task: TTask, position: XYPosition): Node[] => {
  const node: Node = {
    type: taskToNodeType(task),
    id: task.id,
    data: { label: task.taskReferenceName, task },
    position: position,
    className: "react-flow__node-default",
  };
  if (task.type === ETaskType.DECISION) {
    const offset = 200;
    const decisionCases = task.decisionCases;
    const casesKeys = Object.keys(decisionCases);
    const casesNodes = casesKeys.reduce<Node[]>((acc, caseKey, caseIndex) => {
      const caseTasks = decisionCases[caseKey];
      const caseOffset = caseIndex % 2 === 0 ? -offset : offset - offset / 2;
      const casePosition: XYPosition = {
        y: position.y + 100,
        x: position.x + caseOffset * (caseIndex + 1),
      };
      return acc.concat(tasksToNodes(caseTasks, casePosition));
    }, []);
    return [node, ...casesNodes];
  }

  return [node];
};

export const jsonsToTasks = (jsons: any[]): TTask[] => {
  return jsons.reduce<TTask[]>((acc, json) => {
    const task: TTask = { ...json, id: createId() };
    if (task.type === ETaskType.DECISION) {
      return acc.concat({
        ...task,
        decisionCases: Object.keys(task.decisionCases).reduce((acc, key) => {
          return { ...acc, [key]: jsonsToTasks(task.decisionCases[key]) };
        }, {}),
      });
    }
    return acc.concat(task);
  }, []);
};

export const updateTasks = (newTask: TTask, tasks: TTask[]): TTask[] => {
  return tasks.map((task) => {
    if (task.id === newTask.id) return newTask;
    if (task.type === ETaskType.DECISION) {
      return {
        ...task,
        decisionCases: Object.keys(task.decisionCases).reduce((acc, key) => {
          return {
            ...acc,
            [key]: updateTasks(newTask, task.decisionCases[key]),
          };
        }, {}),
      };
    }
    return task;
  });
};

export const findTask = (taskId: string, tasks: TTask[]): TTask | undefined => {
  return tasks.reduce<TTask | undefined>((acc, task) => {
    if (acc) return acc;
    if (task.id === taskId) return task;
    if (task.type === ETaskType.DECISION) {
      return Object.keys(task.decisionCases).reduce<TTask | undefined>(
        (acc1, key) => {
          if (acc1) return acc1;
          return findTask(taskId, task.decisionCases[key]);
        },
        undefined
      );
    }
  }, undefined);
};

export const deleteTask = (taskToDelete: TTask, tasks: TTask[]): TTask[] => {
  return tasks.reduce<TTask[]>((acc, task) => {
    if (task === taskToDelete) {
      return acc;
    }
    if (task.type == ETaskType.DECISION) {
      return acc.concat({
        ...task,
        decisionCases: Object.keys(task.decisionCases).reduce(
          (acc1, key) => ({
            ...acc1,
            [key]: deleteTask(taskToDelete, task.decisionCases[key]),
          }),
          {}
        ),
      });
    }
    return acc.concat(task);
  }, []);
};
