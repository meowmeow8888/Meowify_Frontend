import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import NumberInput from "../components/NumberInput";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [passcode, setPasscode] = useState("");
  const [isContDisabled, setIsContDisabled] = useState(true);
  const navigator = useNavigate();

  useEffect(() => {
    console.log(passcode)
    if (passcode.includes("-")) {
      setIsContDisabled(true);
    } else {
      setIsContDisabled(false);
      handleContinue()
    }
  }, [passcode]);

  const handleContinue = async () => {
    const res = await fetch("http://localhost:8080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passcode: passcode,
      }),
    })
    const data = await res.json()
    //do smth
    navigator("/home");
  };

  return (
    <>
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
        onEnter={handleContinue} />
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <p
          onClick={() => {
            navigator("/signup");
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
    </>
  );
}
export default Verify;
