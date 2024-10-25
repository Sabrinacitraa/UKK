import React from "react";
import { Outlet } from "react-router-dom"
import Sidebar from "./SidebarAdmin";

export default function Layout() {
    return (
        <div className="flex flex-row bg-[#F8EFDE] min-w-min min-h-screen ">
            <Sidebar />
            <div className="flex-1">
                <div> <Outlet /> </div>
            </div>
        </div>
    )
}