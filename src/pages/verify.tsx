import logo from "../assets/logo.png"
import NumberInput from "../components/NumberInput"

function Verify() {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <img src={logo} className="w-75" />
        <p className="text-gradient font-bold text-3xl">
          A verification code was sent to your email address
        </p>
        <p className="text-gradient font-bold text-4xl">
          Please enter it below:
        </p>
      </div>
      <div className="flex flex-row justify-center gap-4 pt-10">
        <NumberInput />
      </div>
    </>
  )
}
export default Verify
