import Input from "../components/Input"
import Button from "../components/Button"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

//TODO:
// link fetch to the server
// after cont -> nav to verify

function Login() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const navigator = useNavigate()
  const [emailError, setEmailError] = useState(false)
  const [emailInputValue, setEmailInputValue] = useState("")
  const [passwordInputValue, setPasswordInputValue] = useState("")
  const [hidePassword, setHidePassword] = useState(true)
  const [isContDisabled, setIsContDisabled] = useState(true)

  const checkSyntax = (email: string) => {
    setEmailError(!emailRegex.test(email))
  }

  useEffect(() => {
    setIsContDisabled(emailError || passwordInputValue.length <= 7)
  }, [emailError, passwordInputValue])

  const handleContinue = () => {
    fetch("http://localhost:8080", {
      method: "POST",
      body: JSON.stringify({
        email: emailInputValue,
        password: passwordInputValue,
      }),
    })
    navigator("/verify")
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col py-2 pb-14">
        <img src={logo} className="w-sm h-auto" />
        <p className="text-6xl text-gradient font-bold">Welcome Back!</p>
      </div>


      <div className="flex justify-center items-center flex-col gap-4">
        <Input
          placeholder="Email"
          variant={emailError ? "error" : "text"}
          onBlur={e => checkSyntax(e.target.value)}
          value={emailInputValue}
          onChange={e => {
            setEmailInputValue(e.target.value)
            checkSyntax(e.target.value)
          }}
        />

        <div className="flex items-center border border-none outline-gray-400 outline-1 pr-3 rounded-sm hover:outline-white transition-colors duration-150 w-72">
          <Input
            placeholder="Password"
            variant="icon"
            value={passwordInputValue}
            type={hidePassword ? "password" : "text"}
            onChange={e => {
              setPasswordInputValue(e.target.value)
            }}
          />

          <Button
            variant="icon"
            onClick={() => {
              setHidePassword(e => !e)
            }}
          >
            {hidePassword ? <Eye /> : <EyeOff />}
          </Button>
        </div>

        {emailError && (
          <div className="flex flex-row gap-1">
            <AlertCircle className="w-4 text-red-400" />
            <p className="text-red-400 ">Please enter a valid Email</p>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={isContDisabled}
          variant={isContDisabled ? "disabled" : "active"}
        >
          Continue
        </Button>
      </div>

      <div className="flex justify-center items-center flex-row gap-2 py-2">
        <p className="text-gray-400">Don't have an account already?</p>
        <p
          onClick={() => {
            navigator("/signup")
          }}
          className="text-[#8c5af8] hover:text-[#ae6cff] cursor-pointer"
        >
          sign up
        </p>
      </div>
    </>
  )
}
export default Login
