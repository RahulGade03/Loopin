import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar.jsx";
const MainLayout = () => {
  return (
    <div className="flex">
        <LeftSideBar/>
        <Outlet/>
    </div>
  );
}

export default MainLayout;