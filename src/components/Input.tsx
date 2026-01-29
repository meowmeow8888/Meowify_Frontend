import type { InputHTMLAttributes } from "react"

type InputVariant = "text" | "error" | "icon"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant: InputVariant
}

function Input({ variant, ...props }: InputProps) {
  const inputTypes: Record<InputVariant, string> = {
    text: "border-none outline-1 p-3 rounded-sm transition-colors duration-150 w-72 outline-gray-400 hover:outline-white",
    error:
      "border-none outline-1 p-3 rounded-sm transition-colors duration-150 w-72 outline-red-400 hover:outline-[#bc5d5f]",
    icon: "flex flex-1 p-3 outline-none",
  }
  return (
    <>
      <input className={`${inputTypes[variant]}`} {...props} />
    </>
  )
}

export default Input
