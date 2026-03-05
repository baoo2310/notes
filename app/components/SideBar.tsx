"use client";
import { FaChevronDown, FaHome, FaRegFileAlt, FaCog } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

export default function SideBar() {
    const { isOpen } = useSidebar();

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-neutral-primary ${isOpen ? 'w-64 border-r border-default-medium opacity-100' : 'w-0 border-transparent opacity-0 -translate-x-4'}`}>
            <div className="w-64 flex flex-col h-full">
                {/* Workspace Mock Icon & Dropdown */}
                <div className="flex items-center justify-between p-4 hover:opacity-70 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-brand text-white font-bold shadow-sm">
                            K
                        </div>
                        <span className="font-semibold text-heading text-sm">KIE's workspace</span>
                    </div>
                    <FaChevronDown className="text-body w-3 h-3" />
                </div>

                {/* Dash / Divider */}
                <hr className="border-t border-default-medium mx-4 my-2" />

                {/* List of Pages */}
                <div className="flex flex-col flex-1 gap-1 px-3 pt-2 pb-4">
                    <div className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:opacity-70 text-heading cursor-pointer transition-all">
                        <FaHome className="text-body w-4 h-4 group-hover:text-brand transition-colors" />
                        <span>Home</span>
                    </div>
                    <div className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:opacity-70 text-heading cursor-pointer transition-all">
                        <FaRegFileAlt className="text-body w-4 h-4 group-hover:text-brand transition-colors" />
                        <span>All Notes</span>
                    </div>
                    <div className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:opacity-70 text-heading cursor-pointer transition-all mt-auto">
                        <FaCog className="text-body w-4 h-4 group-hover:text-brand transition-colors" />
                        <span>Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
}