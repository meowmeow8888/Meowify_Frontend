import { useEffect, useRef, useState } from "react";

function NumberInput({ onChange }: { onChange: Function }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [values, setValues] = useState([-1, -1, -1, -1, -1, -1]);

  const changeValueIn = (value: number, index: number) => {
    setValues((v) =>
      v.map((x, i) => {
        if (i === index) {
          return value;
        }
        return x;
      }),
    );
  };

  const focusInput = (i: number) => {
    const el = inputsRef.current[i];
    if (el) el.focus();
  };

  const handleChange = (value: number, pos: number) => {
    if (!isNaN(value)) {
      changeValueIn(value % 10, pos);
      if (pos !== 5) {
        focusInput(pos + 1);
      }
    } else {
      changeValueIn(-1, pos);
      if (pos !== 0) {
        focusInput(pos - 1);
      }
    }
  };

  useEffect(() => {onChange(values)}, [values])

  return (
    <div className="flex gap-4">
      {Array.from(values).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            if (el) inputsRef.current[i] = el;
          }}
          value={values[i] !== -1 ? values[i] : ""}
          className="w-14 h-16 outline-gray-400 text-center hover:outline-white focus:outline-white border-none outline-1 rounded-sm transition-colors duration-150"
          onKeyDown={(e) => {
            if (e.key == "Backspace") {
              if (values[i] === -1) {
                if (i !== 0) {
                  e.preventDefault();
                  focusInput(i - 1);
                }
              } else {
                handleChange(NaN, i);
              }
            } else if (/^[0-9]$/.test(e.key)) {
              handleChange(parseInt(e.key), i);
            }
          }}
        />
      ))}
    </div>
  );
}
export default NumberInput;
