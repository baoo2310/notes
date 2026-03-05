'use client'

import { ModeSelect } from "./ModeSelect"
import { RiTrelloFill, RiMenuFold2Fill, RiMenuUnfold2Fill } from "react-icons/ri";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSidebar } from "../context/SidebarContext";

export function AppBar() {
    const { isOpen, toggleSidebar } = useSidebar();

    return (
        <div className="w-full min-h-12 max-h-12 flex items-center justify-between pb-4 mb-4 border-b border-border transition-colors duration-300">
            <div className="flex items-center gap-2">
                {isOpen ? (
                    <RiMenuFold2Fill onClick={toggleSidebar} className="mr-2 text-primary text-2xl cursor-pointer hover:text-brand transition-colors" />
                ) : (
                    <RiMenuUnfold2Fill onClick={toggleSidebar} className="mr-2 text-primary text-2xl cursor-pointer hover:text-brand transition-colors" />
                )}
                <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer">
                    <RiTrelloFill className="mr-2" />
                    Notes App
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <ModeSelect />
                <ProfileDropdown />
            </div>
        </div>
    )
}