"use client";

import { useState } from "react";
import { FaRegFileAlt, FaPlus, FaTrash, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { usePage } from "../context/PageContext";
import { trpc } from "@/utils/trpc";

type PageItem = {
    id: string;
    name: string;
    icon_img: string | null;
    parent_page_id: string | null;
};

function buildTree(pages: PageItem[]): (PageItem & { children: PageItem[] })[] {
    const map = new Map<string, PageItem & { children: PageItem[] }>();
    const roots: (PageItem & { children: PageItem[] })[] = [];

    pages.forEach((p) => map.set(p.id, { ...p, children: [] }));
    pages.forEach((p) => {
        const node = map.get(p.id)!;
        if (p.parent_page_id && map.has(p.parent_page_id)) {
            map.get(p.parent_page_id)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

export default function ListPageSideBar() {
    const { workspaceId, selectedPageId, setSelectedPageId } = usePage();

    const { data: pages, isLoading } = trpc.page.getAll.useQuery(
        // @ts-ignore
        { workspace_id: workspaceId },
        { enabled: !!workspaceId }
    );

    const trpcUtils = trpc.useUtils();

    const createPage = trpc.page.create.useMutation({
        onSuccess: (newPage) => {
            if (workspaceId) trpcUtils.page.getAll.invalidate({ workspace_id: workspaceId });
            setSelectedPageId(newPage.id);
        },
    });

    const deletePage = trpc.page.delete.useMutation({
        onSuccess: (deleted) => {
            if (workspaceId) trpcUtils.page.getAll.invalidate({ workspace_id: workspaceId });
            if (selectedPageId === deleted?.id) {
                setSelectedPageId(null);
            }
        },
    });

    if (!workspaceId) return null;

    const handleCreate = (parentId?: string) => {
        createPage.mutate({
            name: "Untitled Page",
            workspace_id: workspaceId,
            parent_page_id: parentId,
        });
    };

    const handleDelete = (e: React.MouseEvent, pageId: string) => {
        e.stopPropagation();
        deletePage.mutate({ id: pageId });
    };

    const tree = pages ? buildTree(pages as PageItem[]) : [];

    return (
        <div className="flex flex-col gap-0.5">
            {/* New Page button */}
            <button
                onClick={() => handleCreate()}
                disabled={createPage.isPending}
                className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent cursor-pointer transition-all disabled:opacity-50"
            >
                <FaPlus className="text-muted-foreground w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                <span>New Page</span>
            </button>

            <hr className="border-t border-border my-1" />

            {isLoading ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>
            ) : tree.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">No pages yet</div>
            ) : (
                tree.map((page) => (
                    <PageTreeNode
                        key={page.id}
                        page={page}
                        depth={0}
                        selectedPageId={selectedPageId}
                        setSelectedPageId={setSelectedPageId}
                        onCreate={handleCreate}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
}

function PageTreeNode({
    page,
    depth,
    selectedPageId,
    setSelectedPageId,
    onCreate,
    onDelete,
}: {
    page: PageItem & { children: (PageItem & { children: PageItem[] })[] };
    depth: number;
    selectedPageId: string | null;
    setSelectedPageId: (id: string) => void;
    onCreate: (parentId?: string) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
}) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = page.children.length > 0;
    const isSelected = selectedPageId === page.id;

    return (
        <div>
            <div
                onClick={() => setSelectedPageId(page.id)}
                className={`group flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium cursor-pointer transition-all
                    ${isSelected ? "bg-accent text-foreground" : "text-foreground hover:bg-accent/50"}`}
                style={{ paddingLeft: `${12 + depth * 16}px`, paddingRight: "12px" }}
            >
                {/* Expand toggle */}
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    className={`w-4 h-4 flex items-center justify-center rounded transition-colors ${hasChildren ? "text-muted-foreground hover:text-foreground" : "invisible"}`}
                >
                    {expanded ? <FaChevronDown size={8} /> : <FaChevronRight size={8} />}
                </button>

                {/* Icon */}
                {page.icon_img ? (
                    <img src={page.icon_img} className="w-4 h-4 rounded-sm object-cover" alt="" />
                ) : (
                    <FaRegFileAlt className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                )}

                {/* Name */}
                <span className="flex-1 truncate text-xs">{page.name}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onCreate(page.id); }}
                        className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                        title="New sub-page"
                    >
                        <FaPlus size={9} />
                    </button>
                    <button
                        onClick={(e) => onDelete(e, page.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                        title="Delete page"
                    >
                        <FaTrash size={9} />
                    </button>
                </div>
            </div>

            {/* Children */}
            {expanded && hasChildren && (
                <div>
                    {page.children.map((child) => (
                        <PageTreeNode
                            key={child.id}
                            page={child as any}
                            depth={depth + 1}
                            selectedPageId={selectedPageId}
                            setSelectedPageId={setSelectedPageId}
                            onCreate={onCreate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}