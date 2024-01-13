import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ModeToggle } from "./components/mode-toggle";

import HomePage from "@/components/main-pages/home-page";
import RegisterPage from "@/components/main-pages/auth-pages/register-page";
import LoginPage from "@/components/main-pages/auth-pages/login-page";
import ProfilePage from "./components/main-pages/profile-page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <div className="fixed right-5 bottom-5">
        <ModeToggle />
      </div>
    </Router>
  );
}

export default App;
