import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import NumberInput from "../components/NumberInput";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function Verify() {
  const [passcode, setPasscode] = useState("");
  const [isContDisabled, setIsContDisabled] = useState(true);
  const [passcodeError, setPasscodeError] = useState(false);
  const { refreshSession } = useAuth();
  const location = useLocation();
  const navigator = useNavigate()
  const email = location.state?.emailInputValue;
  const password = location.state?.passwordInputValue;
  


  useEffect(() => {
    console.log(passcode)
    if (passcode.includes("-")) {
      setIsContDisabled(true);
      setPasscodeError(false)
    } else {
      setIsContDisabled(false);
    }
  }, [passcode]);

  const handleContinue = async () => {
    try {
      const res = await fetch("http://localhost:8080/verify", {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          passcode: passcode,
        }),
      })
      if (!res.ok) {
        throw new Error("Verify failed");
      }
      navigator("/")
      await refreshSession();

    } catch (error) {
      setIsContDisabled(true)
      setPasscodeError(true)
      console.log("Error:", error);
    }
  };

  const request_new_code = async () => {
    try {
      const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!res.ok) {
      throw new Error("new code req failed");
    }

  } catch (error) {
    console.log("Error:", error);
  }
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,#2a1450_0%,#000_60%)] h-screen">
      <div className="flex flex-col justify-center items-center">
        <img src={logo} className="w-75 hover:animate-spin" />
        <p className="text-gradient font-bold text-3xl">
          A verification code was sent to your email address
        </p>
        <p className="text-gradient font-bold text-4xl">
          Please enter it below:
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 py-10">
        <NumberInput onChange={setPasscode} 
        onEnter={handleContinue}
        passcodeError={passcodeError} />
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <p
          onClick={() => {
            request_new_code()
          }}
          className="text-[#8c5af8] hover:text-[#ae6cff] cursor-pointer"
        >
          Re-send passcode
        </p>
        <Button
          onClick={handleContinue}
          disabled={isContDisabled}
          variant={isContDisabled ? "disabled" : "active"}
        >
          Submit
        </Button>
      </div>
  </div>
  );
}
export default Verify;
