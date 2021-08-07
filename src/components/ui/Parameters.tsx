import { assoc, omit } from "ramda";
import { Input } from "./Input";

export type TParameters = Record<string, string>;

export const Parameters: React.FC<{
  value: TParameters;
  onChange?: (value: TParameters) => void;
  label?: string;
}> = ({ value: parameters, onChange: setParameters, label }) => {
  const setParameter = (key: string, value: string) => {
    return setParameters?.(assoc(key, value, parameters));
  };
  const addParameter = () => {
    const key = window.prompt("Parameter key");
    if (!key) return;
    setParameters?.(assoc(key, "", parameters));
  };
  const deleteParameter = (key: string) => {
    setParameters?.(omit([key], parameters));
  };
  return (
    <>
      {label && <h3>{label}</h3>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(parameters).map((key) => {
          const value = parameters[key];
          return (
            <div key={key} style={{ display: "flex" }}>
              <div style={{ flexGrow: 1 }}>{key}</div>
              <Input
                value={value}
                onChange={(value) => setParameter(key, value)}
              />
              <button onClick={() => deleteParameter(key)}>x</button>
            </div>
          );
        })}
        <button onClick={addParameter}>Add parameter</button>
      </div>
    </>
  );
};
