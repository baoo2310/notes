"use client";

import NoteContent from "./contents/NoteContent";
import KanbanBoard from "./contents/kanban";
import { trpc } from "@/utils/trpc";

export type BlockType = "NOTE" | "BOARD" | "CALENDAR" | "LINK";
export type BlockSize = "small" | "medium" | "large";
export type BlockPosition = "full" | "left" | "right";

export interface PageBlock {
    id: string;
    type: BlockType;
    position_order: number;
    position_col: BlockPosition;
    size: BlockSize;
    content?: any;
}

interface PageContentProps {
    blocks: PageBlock[];
}

function BlockRenderer({ block }: { block: PageBlock }) {
    // A mapping for how wide the block should be based on size/position
    const sizeClasses = {
        small: "h-48",
        medium: "h-96",
        large: "h-full min-h-[500px]"
    };

    const widthClasses = {
        full: "w-full",
        left: "w-1/2 pr-2",
        right: "w-1/2 pl-2"
    };

    const wrapperClass = `mb-4 ${widthClasses[block.position_col] || "w-full"}`;
    const contentClass = `w-full rounded-lg bg-neutral-primary border border-default-medium overflow-hidden ${sizeClasses[block.size] || "h-auto"}`;

    const renderContent = () => {
        switch (block.type) {
            case "NOTE":
                return <NoteContent />; // Eventually pass block.content here
            case "BOARD":
                return <div className="h-full w-full overflow-hidden"><KanbanBoard /></div>;
            case "CALENDAR":
                return <div className="p-4 flex items-center justify-center h-full text-body bg-brand/10">Calendar View Placeholder</div>;
            case "LINK":
                return <div className="p-4 flex items-center justify-center h-full text-body bg-brand/10">Link Redirecting...</div>;
            default:
                return <div className="p-4 flex items-center justify-center h-full text-body bg-brand/10">Unsupported Page Type</div>;
        }
    };

    return (
        <div className={wrapperClass}>
            <div className={contentClass}>
                {renderContent()}
            </div>
        </div>
    );
}

export default function PageContentRenderer({ blocks }: PageContentProps) {
    const helloQuery = trpc.hello.useQuery();

    if (!blocks || blocks.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-body">
                {helloQuery.data && <p className="text-brand font-bold mb-4">{helloQuery.data}</p>}
                <p>This page is empty. Add a block to get started.</p>
            </div>
        );
    }

    // Sort blocks by order
    const sortedBlocks = [...blocks].sort((a, b) => a.position_order - b.position_order);

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-wrap content-start">
            {helloQuery.data && (
                <div className="w-full p-4 mb-4 rounded-lg bg-brand/20 text-brand font-bold text-center border-2 border-brand/50">
                    Backend Connection Success! {helloQuery.data}
                </div>
            )}
            {sortedBlocks.map(block => (
                <BlockRenderer key={block.id} block={block} />
            ))}
        </div>
    );
}
