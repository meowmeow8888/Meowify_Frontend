import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./pages/login"
import SignUp from "./pages/signup"
import Verify from "./pages/verify"
import { useEffect } from "react"

function App() {
  const nav = useNavigate()
  useEffect(() => {nav("login")}, [])
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  )
}
export default App
