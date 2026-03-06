"use client";
import { FaCog } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import ListPageSideBar from "./ListPageSideBar";

export default function SideBar() {
    const { isOpen } = useSidebar();

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-card ${isOpen ? 'w-64 border-r border-border opacity-100' : 'w-0 border-transparent opacity-0 -translate-x-4'}`}>
            <div className="w-64 flex flex-col h-full">
                {/* Workspace Mock Icon & Dropdown */}
                <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold shadow-sm">
                                K
                            </div>
                            <span className="font-semibold text-foreground text-sm">KIE&apos;s workspace</span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-border mx-4 my-1" />

                {/* Pages list from DB */}
                <div className="flex flex-col flex-1 px-3 pt-2 pb-4 overflow-y-auto">
                    <ListPageSideBar />
                </div>

                {/* Settings at bottom */}
                <div className="px-3 pb-4 mt-auto">
                    <hr className="border-t border-border mb-2" />
                    <div className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-foreground cursor-pointer transition-all">
                        <FaCog className="text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
}