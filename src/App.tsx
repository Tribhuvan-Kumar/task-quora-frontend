import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "@/components/main-pages/home-page";
import RegisterPage from "@/components/main-pages/auth-pages/register-page";
import LoginPage from "@/components/main-pages/auth-pages/login-page";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      <div className="fixed right-5 bottom-5">
        <ModeToggle />
      </div>
    </Router>
  );
}

export default App;
