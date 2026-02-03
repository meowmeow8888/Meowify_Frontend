import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import Input from "../components/Input"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

function SignUp() {
  const navigator = useNavigate()
  const [emailError, setEmailError] = useState(0)

  return (
    <>
      <div className="flex justify-center items-center py-2 flex-col">
        <img src={logo} className="w-sm h-auto" />
        <p className="text-4xl font-bold py-2">
          Sign Up and start listening!
        </p>
      </div>
      <br />
      <div className="flex justify-center">
        <div className="inline-flex flex-col items-start">
          <Input
            variant="text"
            placeholder="Email"
            className="mx-auto border-none outline-gray-400 outline-1 p-3 rounded-sm hover:outline-white transition-colors duration-150 w-72"
          />
          <button onClick={() => setEmailError(1)}>bla</button>
          {emailError ? (
            <div className="flex flex-row">
              <AlertCircle className="w-4 text-red-400" />
              <p className="text-red-400 px-1">example@domain.com</p>
            </div>
          ):<></>}
        </div>
        <div className="flex justify-center items-center flex-row gap-2 py-2">
        <p className="text-gray-400">don't have an account already?</p>
        <p
          onClick={() => {
            navigator("/login")
          }}
          className="text-[#8c5af8] hover:text-[#ae6cff] cursor-pointer"
        >
          sign up
        </p>
      </div>
      </div>
    </>
  )
}
export default SignUp
