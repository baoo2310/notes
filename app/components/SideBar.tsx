"use client";
import { useEffect } from "react";
import { FaCog, FaPlus } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import { usePage } from "../context/PageContext";
import ListPageSideBar from "./ListPageSideBar";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

export default function SideBar() {
    const { isOpen } = useSidebar();
    const { workspaceId, setWorkspaceId } = usePage();
    const { data: session } = useSession();

    // Fetch workspaces if logged in
    const { data: workspaces, isLoading } = trpc.workspace.getAll.useQuery(undefined, {
        enabled: !!session?.user?.id
    });
    const trpcUtils = trpc.useUtils();

    const createWorkspace = trpc.workspace.create.useMutation({
        onSuccess: (newWs) => {
            trpcUtils.workspace.getAll.invalidate();
            setWorkspaceId(newWs.id);
        }
    });

    // Auto-select first workspace if none selected
    useEffect(() => {
        if (!workspaceId && workspaces && workspaces.length > 0) {
            setWorkspaceId(workspaces[0].id);
        }
    }, [workspaces, workspaceId, setWorkspaceId]);

    const activeWorkspace = workspaces?.find(w => w.id === workspaceId);

    const handleCreateWorkspace = () => {
        createWorkspace.mutate({ name: `${session?.user?.name || 'My'}'s Workspace` });
    };

    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col bg-card ${isOpen ? 'w-64 border-r border-border opacity-100' : 'w-0 border-transparent opacity-0 -translate-x-4'}`}>
            <div className="w-64 flex flex-col h-full">
                {/* Workspace Mock Icon & Dropdown */}
                <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold shadow-sm uppercase">
                                {activeWorkspace?.name?.charAt(0) || "W"}
                            </div>
                            <span className="font-semibold text-foreground text-sm truncate w-32">
                                {activeWorkspace?.name || "No Workspace"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-t border-border mx-4 my-1" />

                {/* Pages list from DB */}
                <div className="flex flex-col flex-1 px-3 pt-2 pb-4 overflow-y-auto">
                    {!session ? (
                        <div className="p-3 text-xs text-muted-foreground text-center">Sign in to view your pages.</div>
                    ) : isLoading ? (
                        <div className="p-3 text-xs text-muted-foreground">Loading workspaces...</div>
                    ) : !workspaces || workspaces.length === 0 ? (
                        <button
                            disabled={createWorkspace.isPending}
                            onClick={handleCreateWorkspace}
                            className="w-full flex justify-center items-center gap-2 p-2 mt-4 text-xs font-medium text-primary-foreground bg-primary rounded-md transition hover:bg-primary/90 disabled:opacity-50"
                        >
                            <FaPlus /> Create Workspace
                        </button>
                    ) : (
                        <ListPageSideBar />
                    )}
                </div>

                {/* Settings at bottom */}
                <div className="px-3 pb-4 mt-auto">
                    <hr className="border-t border-border mb-2" />
                    <Link href="/settings" className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-foreground cursor-pointer transition-all">
                        <FaCog className="text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}