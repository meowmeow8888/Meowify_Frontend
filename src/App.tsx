import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Verify from "./pages/verify";
import Home from "./pages/home";

import { AuthProvider, useAuth } from "./providers/AuthProvider";

function AppShell() {
  return (
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
  );
}

function AppRoutes() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return <AppShell />;
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;