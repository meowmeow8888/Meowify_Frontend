import { Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import SignUp from "./pages/signup"
import Verify from "./pages/verify"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  )
}
export default App
