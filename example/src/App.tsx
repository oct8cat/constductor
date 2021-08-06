import React from "react";
import { Constductor, ETaskType, TTask, jsonsToTasks } from "constductor";
import "constductor/build/src/index.css";

const App: React.FC = () => {
  const [tasks, setTasks] = React.useState<TTask[]>(
    jsonsToTasks([
      {
        type: ETaskType.SIMPLE,
        taskReferenceName: "send_alert",
        name: "send_alert",
      },
      {
        type: ETaskType.WAIT,
        taskReferenceName: "wait_reply",
        name: "wait_reply",
      },
      {
        type: ETaskType.DECISION,
        taskReferenceName: "decide_reply",
        name: "decide_reply",
        caseValueParam: "value",
        decisionCases: {
          confirm: [
            {
              type: ETaskType.SIMPLE,
              taskReferenceName: "send_confirmed",
              name: "send_confirmed",
            },
            {
              type: ETaskType.DECISION,
              taskReferenceName: "decide_noshow",
              name: "decide_noshow",
              caseValueParam: "value",
              decisionCases: {
                yes: [
                  {
                    type: ETaskType.SIMPLE,
                    taskReferenceName: "send_noshow",
                    name: "send_noshow",
                  },
                ],
                no: [
                  {
                    type: ETaskType.SIMPLE,
                    taskReferenceName: "send_bye",
                    name: "send_bye",
                  },
                ],
              },
            },
          ],
          cancel: [
            {
              type: ETaskType.SIMPLE,
              taskReferenceName: "send_cancelled",
              name: "send_cancelled",
            },
          ],
        },
      },
      {
        type: ETaskType.SIMPLE,
        taskReferenceName: "send_survey",
        name: "send_survey",
      },
    ])
  );
  return <Constductor value={tasks} onChange={setTasks} />;
};

export default App;
