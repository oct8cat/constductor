export const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  return (
    <div>
      <label htmlFor="">
        <div>{label}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
};
