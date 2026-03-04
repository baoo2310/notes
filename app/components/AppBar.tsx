'use client'

import { ModeSelect } from "./ModeSelect"
import { RiTrelloFill } from "react-icons/ri";
import { ProfileDropdown } from "./ProfileDropdown";

export function AppBar() {
    return (
        <div className="w-full min-h-12 max-h-12 flex items-center justify-between pb-4 mb-4 border-b border-border transition-colors duration-300">
            <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer">
                <RiTrelloFill className="mr-2" />
                Notes App
            </h1>
            <div className="flex items-center gap-2">
                <ModeSelect />
                <ProfileDropdown />
            </div>
        </div>
    )
}