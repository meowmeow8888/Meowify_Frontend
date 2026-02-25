import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Input from "../components/Input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../components/Button";

function SignUp() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/;
  const navigator = useNavigate();
  const [emailInputValue, setEmailInputValue] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [isContDisabled, setIsContDisabled] = useState(true);

  const checkEmailSyntax = (email: string) => {
    setEmailError(!emailRegex.test(email));
  };

  const checkPasswordSyntax = (password: string) => {
    setPasswordError(!passwordRegex.test(password));
  };

  const handleContinue = async () => {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailInputValue,
          password: passwordInputValue,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sign Up Failed");
      }

      const data = await res.json(); //do smtng with this shit
      console.log("Sign Up successful:", data);
      navigator("/verify");
    } catch (error) {
      console.log("Error:", error); //take care of loading
    }
  };

  useEffect(() => {
    setIsContDisabled(
      emailError ||
        emailInputValue.length === 0 ||
        passwordInputValue.length <= 7,
    );
  }, [emailError, passwordInputValue]);

  return (
    <>
      <div className="flex justify-center items-center py-2 flex-col">
        <img src={logo} className="w-sm h-auto" />
        <p className="text-4xl font-bold py-2 text-gradient">
          Sign Up and start listening!
        </p>
      </div>

      <br />

      <div className="flex justify-center">
        <div className="flex flex-col w-72 gap-4">
          <Input
            placeholder="Email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
            variant={emailError ? "error" : "text"}
            onBlur={(e) => checkEmailSyntax(e.target.value)}
            value={emailInputValue}
            onChange={(e) => {
              setEmailInputValue(e.target.value);
              checkEmailSyntax(e.target.value);
            }}/>
          
          {emailError && (
            <div className="flex flex-row gap-1">
              <AlertCircle className="w-4 text-red-400" />
              <p className="text-red-400 ">Please enter a valid email</p>
            </div>
          )}

          <div
            className={`flex items-center outline-1 pr-3 rounded-sm transition-colors duration-150 w-72 
              ${passwordError 
              ? `outline-red-400 hover:outline-[#bc5d5f]` 
              : `outline-gray-400 hover:outline-white`}`}>
            
            <Input
              placeholder="Password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleContinue();
                }
              }}
              variant="icon"
              onBlur={(e) => checkPasswordSyntax(e.target.value)}
              value={passwordInputValue}
              type={hidePassword ? "password" : "text"}
              onChange={(e) => {
                setPasswordInputValue(e.target.value);
                checkPasswordSyntax(e.target.value);
              }}
            />

            <Button
              variant="icon"
              onClick={() => {
                setHidePassword((e) => !e);
              }}
            >
              {hidePassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>
          {/* split to seperate paragraphs and add indiv checks for syntax */}
          {passwordError && (
            <div className="flex flex-row gap-1">
              <AlertCircle className="w-4 text-red-400" />
              <p className="text-red-400 ">Please enter a valid password<br/>
                password must contain:<br/>
                One uppercase letter<br/>
                One lowercase letter<br/>
                One digit<br/>
                length 8-32
              </p>
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
      </div>

      <div className="flex justify-center items-center flex-col gap-2 py-2">
        <p className="text-gray-400">Already have an account?</p>
        <p
          onClick={() => {
            navigator("/");
          }}
          className="text-[#8c5af8] hover:text-[#ae6cff] cursor-pointer"
        >
          login
        </p>
      </div>
    </>
  );
}
export default SignUp;
