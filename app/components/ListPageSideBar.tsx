"use client";

import { FaRegFileAlt, FaPlus, FaTrash } from "react-icons/fa";
import { usePage } from "../context/PageContext";
import { trpc } from "@/utils/trpc";

export default function ListPageSideBar() {
    const { workspaceId, selectedPageId, setSelectedPageId } = usePage();

    const { data: pages, isLoading } = trpc.page.getAll.useQuery(
        { workspace_id: workspaceId },
    );

    const trpcUtils = trpc.useUtils();

    const createPage = trpc.page.create.useMutation({
        onSuccess: (newPage) => {
            trpcUtils.page.getAll.invalidate({ workspace_id: workspaceId });
            setSelectedPageId(newPage.id);
        },
    });

    const deletePage = trpc.page.delete.useMutation({
        onSuccess: (deleted) => {
            trpcUtils.page.getAll.invalidate({ workspace_id: workspaceId });
            // If the deleted page was selected, clear selection
            if (selectedPageId === deleted?.id) {
                setSelectedPageId(null);
            }
        },
    });

    const handleCreate = () => {
        createPage.mutate({
            name: "Untitled Page",
            workspace_id: workspaceId,
        });
    };

    const handleDelete = (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        deletePage.mutate({ id: pageId });
    };

    return (
        <div className="flex flex-col gap-0.5">
            {/* New Page button */}
            <button
                onClick={handleCreate}
                disabled={createPage.isPending}
                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent cursor-pointer transition-all disabled:opacity-50"
            >
                <FaPlus className="text-muted-foreground w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                <span>New Page</span>
            </button>

            {/* Divider */}
            <hr className="border-t border-border my-1" />

            {/* Page list */}
            {isLoading ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>
            ) : !pages || pages.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">No pages yet</div>
            ) : (
                pages.map((page) => (
                    <div
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-all
                            ${selectedPageId === page.id
                                ? "bg-accent text-foreground"
                                : "text-foreground hover:bg-accent/50"
                            }`}
                    >
                        {page.icon_img ? (
                            <img src={page.icon_img} className="w-4 h-4 rounded-sm object-cover" alt="" />
                        ) : (
                            <FaRegFileAlt className={`w-4 h-4 transition-colors ${selectedPageId === page.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                        )}
                        <span className="flex-1 truncate">{page.name}</span>
                        <button
                            onClick={(e) => handleDelete(e, page.id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5"
                            title="Delete page"
                        >
                            <FaTrash size={11} />
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}