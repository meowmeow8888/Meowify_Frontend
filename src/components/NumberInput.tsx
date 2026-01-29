import { useEffect, useRef, useState } from "react";

function NumberInput() {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [focusPos, setFocusPos] = useState(0);
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

  const handleChange = (value: number, pos: number) => {
    if (!isNaN(value)) {
      changeValueIn(value % 10, pos);
      inputRefs.current[(pos + 1) % 6].focus();
    } else {
      changeValueIn(-1, pos);
      inputRefs.current[(pos - 1) % 6].focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      console.log("focuspos: " + focusPos);
      handleChange(NaN, focusPos);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex gap-4">
      {Array.from(values).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            if (el) inputRefs.current[i] = el;
          }}
          value={values[i] !== -1 ? values[i] : ""}
          className="w-14 h-16 outline-gray-400 text-center hover:outline-white border-none outline-1 rounded-sm transition-colors duration-150"
          onChange={(e) => {
            handleChange(parseInt(e.target.value), i);
          }}
          onFocus={() => {
            console.log("I CHANGED THE WORLD: " + i);
            setFocusPos(i);
          }}
        />
      ))}
    </div>
  );
}
export default NumberInput;
