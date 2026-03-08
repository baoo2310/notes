"use client";

import { useState } from "react";
import { FaTrash, FaExpand, FaTimes } from "react-icons/fa";
import PageHeadBar from "./contents/PageHeadBar";
import KanbanBoard from "./contents/kanban";
import NoteBlock from "./contents/NoteBlock";
import CalendarBlock from "./contents/CalendarBlock";
import LinkBlock from "./contents/LinkBlock";
import PomodoroBlock from "./contents/PomodoroBlock";
import ClockBlock from "./contents/ClockBlock";
import BlockToolbar from "./BlockToolbar";
import { trpc } from "@/utils/trpc";
import { usePage } from "../context/PageContext";

export type BlockType = "NOTE" | "BOARD" | "CALENDAR" | "LINK" | "POMODORO" | "CLOCK";

export interface PageBlock {
    id: string;
    page_id: string;
    type: BlockType;
    order: number;
    content?: any;
}

export interface PageData {
    id: string;
    name: string;
    icon_img?: string | null;
    background_img?: string | null;
}

interface ChildPageData {
    id: string;
    name: string;
    icon_img?: string | null;
}

interface PageContentProps {
    page?: PageData | null;
    blocks: PageBlock[];
    childPages?: ChildPageData[];
}

function BlockCard({ block }: { block: PageBlock }) {
    const [modalOpen, setModalOpen] = useState(false);
    const trpcUtils = trpc.useUtils();

    const deleteBlock = trpc.page.deleteBlock.useMutation({
        onSuccess: () => {
            trpcUtils.page.getById.invalidate({ id: block.page_id });
        },
    });

    const renderContent = () => {
        switch (block.type) {
            case "NOTE":
                return <NoteBlock blockId={block.id} initialContent={block.content} />;
            case "BOARD":
                return <KanbanBoard blockId={block.id} initialContent={block.content} />;
            case "CALENDAR":
                return <CalendarBlock />;
            case "LINK":
                return <LinkBlock blockId={block.id} initialContent={block.content} />;
            case "POMODORO":
                return <PomodoroBlock blockId={block.id} />;
            case "CLOCK":
                return <ClockBlock />;
            default:
                return <div className="p-4 flex items-center justify-center h-full text-muted-foreground">Unsupported Block</div>;
        }
    };

    const canExpand = ["POMODORO", "CLOCK"].includes(block.type);

    // Grid sizes
    const sizeClass = block.type === "BOARD"
        ? "col-span-full row-span-2"
        : block.type === "CALENDAR"
            ? "col-span-1 row-span-2"
            : "col-span-1 row-span-1";

    return (
        <>
            <div className={`bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group relative ${sizeClass}`}>
                {/* Toolbar — bottom-right, shown on hover */}
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canExpand && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="p-1.5 rounded-md bg-card/80 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Expand"
                        >
                            <FaExpand size={10} />
                        </button>
                    )}
                    <button
                        onClick={() => deleteBlock.mutate({ id: block.id })}
                        className="p-1.5 rounded-md bg-card/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete block"
                    >
                        <FaTrash size={10} />
                    </button>
                </div>

                <div className="h-full w-full overflow-auto">
                    {renderContent()}
                </div>
            </div>

            {/* Modal overlay */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="relative bg-card border border-border rounded-2xl shadow-2xl w-[90vw] max-w-2xl h-[80vh] max-h-[720px] overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 z-10 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            title="Close"
                        >
                            <FaTimes size={14} />
                        </button>

                        <div className="h-full w-full overflow-auto flex items-center justify-center">
                            <div style={{ transform: "scale(1.5)" }}>
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function PageContentRenderer({ page, blocks, childPages }: PageContentProps) {
    const { setSelectedPageId } = usePage();
    const sortedBlocks = blocks ? [...blocks].sort((a, b) => a.order - b.order) : [];

    return (
        <div className="flex-1 overflow-y-auto w-full h-full flex flex-col bg-background">
            {/* === STATIC PAGE HEADER === */}
            <PageHeadBar page={page} />

            {/* === CHILD PAGES === */}
            {childPages && childPages.length > 0 && (
                <div className="max-w-5xl mx-auto w-full px-6 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sub-pages</p>
                    <div className="flex flex-wrap gap-2">
                        {childPages.map((child) => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedPageId(child.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors text-sm"
                            >
                                {child.icon_img ? (
                                    <img src={child.icon_img} className="w-4 h-4 rounded-sm object-cover" alt="" />
                                ) : (
                                    <span className="text-sm">📄</span>
                                )}
                                <span className="text-foreground font-medium">{child.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* === BLOCKS GRID === */}
            <div className="max-w-5xl mx-auto w-full px-6 pb-24 flex-1">
                {!blocks || blocks.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                        <p>This page is empty. Click the <span className="text-primary font-semibold">+</span> button to add a block.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
                        {sortedBlocks.map((block) => (
                            <BlockCard key={block.id} block={block} />
                        ))}
                    </div>
                )}

                {/* Block toolbar FAB */}
                {page && <BlockToolbar pageId={page.id} />}
            </div>
        </div>
    );
}
