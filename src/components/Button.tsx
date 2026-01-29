type ButtonVariant = "active" | "disabled" | "icon"
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant
}
function Button({
  children,
  onClick,
  disabled,
  variant,
  ...props
}: ButtonProps) {
  const buttonTypes: Record<ButtonVariant, string> = {
    active:
      "w-72 bg-[#6937f4] p-3 rounded-full border-none text-white hover:bg-[#9345fd] transition-colors duration-150 cursor-pointer",
    disabled: "w-72 bg-[#222] p-3 rounded-full border-none text-white",
    icon: "cursor-pointer text-gray-400 hover:text-white transition-colors duration-150",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...props}
      className={`${buttonTypes[variant] ?? ""}`}
    >
      {children}
    </button>
  )
}

export default Button
