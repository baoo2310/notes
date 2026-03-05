"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { MdDragHandle } from "react-icons/md";
import PageHeadBar from "./contents/PageHeadBar";
import KanbanBoard from "./contents/kanban";
import { trpc } from "@/utils/trpc";

// NOTE removed: Now only dynamic blocks can be dragged/resized
export type BlockType = "BOARD" | "CALENDAR" | "LINK";

export interface PageBlock {
    id: string;
    page_id: string;
    type: BlockType;
    pos_x: number;
    pos_y: number;
    width: number;
    height: number;
    z_index: number;
    content?: any;
}

interface PageContentProps {
    blocks: PageBlock[];
}

function BlockRenderer({ block }: { block: PageBlock }) {
    const [position, setPosition] = useState({ x: block.pos_x, y: block.pos_y });
    const [size, setSize] = useState({ width: block.width, height: block.height });

    const trpcUtils = trpc.useUtils();
    const updateBlock = trpc.page.updateBlockPosition.useMutation({
        onSettled: () => {
            trpcUtils.page.getById.invalidate({ id: block.page_id });
        }
    });

    const handleDragStop = (e: any, data: { x: number, y: number }) => {
        setPosition({ x: data.x, y: data.y });
        updateBlock.mutate({
            id: block.id,
            pos_x: data.x,
            pos_y: data.y,
            width: size.width,
            height: size.height,
            z_index: block.z_index,
        });
    };

    const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: { x: number, y: number }) => {
        const newWidth = parseInt(ref.style.width, 10);
        const newHeight = parseInt(ref.style.height, 10);

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: position.x, y: position.y });

        updateBlock.mutate({
            id: block.id,
            pos_x: position.x,
            pos_y: position.y,
            width: newWidth,
            height: newHeight,
            z_index: block.z_index,
        });
    };

    const renderContent = () => {
        switch (block.type) {
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
        <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            dragHandleClassName="drag-top-bar"
            bounds="parent"
            style={{ zIndex: block.z_index }}
            className="rounded-lg bg-neutral-primary border border-default-medium shadow-sm hover:shadow-md transition-shadow group flex flex-col"
        >
            <div className="drag-top-bar w-full h-6 bg-brand/5 border-b border-default-soft flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <MdDragHandle className="text-body-muted text-lg" />
            </div>

            <div className="flex-1 w-full h-full overflow-auto relative">
                {renderContent()}
            </div>
        </Rnd>
    );
}

export default function PageContentRenderer({ blocks }: PageContentProps) {
    const helloQuery = trpc.hello.useQuery();

    const sortedBlocks = blocks ? [...blocks].sort((a, b) => a.z_index - b.z_index) : [];

    return (
        <div className="flex-1 overflow-y-auto w-full h-full flex flex-col bg-background">
            {/* === STATIC PAGE HEADER === */}
            <PageHeadBar />

            {/* === DRAGGABLE BLOCKS CANVAS === */}
            {/* The canvas takes up the remaining height, and is relative so Rnd works perfectly */}
            <div className="flex-1 w-full relative min-h-[800px]">

                {!blocks || blocks.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-body-muted py-20">
                        <p>This page is empty. Select a block from the menu to get started.</p>
                    </div>
                ) : (
                    sortedBlocks.map(block => (
                        <BlockRenderer key={block.id} block={block} />
                    ))
                )}
            </div>
        </div>
    );
}
