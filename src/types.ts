export enum ETaskType {
  SIMPLE = "SIMPLE",
  DECISION = "DECISION",
  WAIT = "WAIT",
  BEGIN = "BEGIN",
  END = "END",
}

export type TTaskType<T> = {
  id: string;
  taskReferenceName: string;
  name: string;
} & T;

export type TSimpleTask = TTaskType<{
  type: ETaskType.SIMPLE;
}>;

export type TDecisionTask = TTaskType<{
  type: ETaskType.DECISION;
  caseValueParam: string;
  decisionCases: TTasks;
  defaultCase?: TTask[];
}>;

export type TBeginTask = TTaskType<{
  type: ETaskType.BEGIN;
  taskReferenceName: "begin";
  name: "begin";
}>;

export type TEndTask = TTaskType<{
  type: ETaskType.END;
  taskReferenceName: "end";
  name: "end";
}>;

export type TVirtualTask = TBeginTask | TEndTask;

export type TTask = TVirtualTask | TSimpleTask | TDecisionTask;

export type TTasks = Record<string, TTask[]>;
