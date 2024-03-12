import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashbord from "./components/Dashbord";
import Error404 from "./components/Error404";

import "./globals.css";
import useAuth from "./hook/useAuth";
import Landing from "./components/Landing";

function App() {
  const { user, isLogin } = useAuth();
  console.log(user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Landing} />
          <Route path="/login" Component={Login} />
          <Route path="*" Component={Error404} />
          <Route path="/register" Component={Register} />
          <Route path="/dashbord/*" element={isLogin && !user ? "" : user && user.isAdmin ? <Dashbord /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
