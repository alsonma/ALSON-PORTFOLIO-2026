
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProfileSelect from "../pages/PROFILESELECT/ProfileSelect";
import Login from "../pages/LOGIN/Login";
import Home from "../pages/HOME/Home";
import PaintIntro from "../components/PAINTING/PaintIntro";
import CustomCursor from "../components/CURSOR/CustomCursor";
import Admin from "../pages/ADMIN/Admin";
import ProtectedRoute from "./ProtectedRoute";

function RecruiterPage() {
  return (
    <>
      <PaintIntro />
      <CustomCursor />
      <Home />
    </>
  );
}

function UserPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080910",
        color: "white",
        display: "grid",
        placeItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div>
        <h1>User portal</h1>
        <p>Your login was successful.</p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfileSelect />} />

        <Route path="/recruiter" element={<RecruiterPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/user" element={<UserPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>

      <CustomCursor />
    </BrowserRouter>
  );
}
