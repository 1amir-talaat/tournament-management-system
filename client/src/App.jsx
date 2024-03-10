import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashbord from "./components/Dashbord";
import DataTableDemo from "./components/Table";
import "./globals.css";
import Error404 from "./components/Error404";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="*" Component={Error404} />
          <Route path="/table" Component={DataTableDemo} />
          <Route path="/register" Component={Register} />
          <Route path="/dashbord/*" Component={Dashbord} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
