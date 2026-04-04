import React from "react";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar.jsx";
const MainLayout = () => {
  return (
    <div className="flex max-w-[1200px] w-full mx-auto">
        <LeftSideBar/>
        <div className="ml-[3vw]">
          <Outlet/>
        </div>
    </div>
  );
}

export default MainLayout;