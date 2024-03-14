import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashbord from "./components/Dashbord";
import Error404 from "./components/Error404";

import "./globals.css";
import useAuth from "./hook/useAuth";
import Landing from "./components/Landing";
import Layout from "./components/Layout";
import ChoseEventsCount from "./components/ChoseEventsCount";

function App() {
  const { user, isLogin } = useAuth();
  console.log(user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="*" Component={Error404} />
          <Route path="/chose-event-count" Component={ChoseEventsCount} />
          <Route path="/test" Component={ChoseEventsCount} />
          <Route path="/register" Component={Register} />
          <Route path="/dashboard/*" element={isLogin ? <Dashbord /> : <Navigate to="/login" replace />} />
          <Route path="/" Component={Layout}>
            <Route index Component={Landing} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
