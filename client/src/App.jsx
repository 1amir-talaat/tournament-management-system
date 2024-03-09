import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SideBarLayout from "./components/SideBarLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/sidebar/*" Component={SideBarLayout} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
