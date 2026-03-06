"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlus, FaStickyNote, FaTrello, FaCalendarAlt, FaLink } from "react-icons/fa";
import { trpc } from "@/utils/trpc";
import { usePage } from "@/app/context/PageContext";

type BlockTypeOption = {
    type: "NOTE" | "BOARD" | "CALENDAR" | "LINK";
    label: string;
    icon: React.ReactNode;
    defaultWidth: number;
    defaultHeight: number;
};

const BLOCK_OPTIONS: BlockTypeOption[] = [
    { type: "NOTE", label: "Note", icon: <FaStickyNote size={14} />, defaultWidth: 300, defaultHeight: 250 },
    { type: "BOARD", label: "Board", icon: <FaTrello size={14} />, defaultWidth: 600, defaultHeight: 400 },
    { type: "CALENDAR", label: "Calendar", icon: <FaCalendarAlt size={14} />, defaultWidth: 350, defaultHeight: 350 },
    { type: "LINK", label: "Link", icon: <FaLink size={14} />, defaultWidth: 220, defaultHeight: 200 },
];

export default function BlockToolbar({ pageId }: { pageId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const trpcUtils = trpc.useUtils();
    const addBlock = trpc.page.addBlock.useMutation({
        onSuccess: () => {
            trpcUtils.page.getById.invalidate({ id: pageId });
            setIsOpen(false);
        },
    });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAdd = (option: BlockTypeOption) => {
        // Randomize position slightly so blocks don't stack exactly
        const offsetX = Math.floor(Math.random() * 200) + 20;
        const offsetY = Math.floor(Math.random() * 200) + 20;

        addBlock.mutate({
            page_id: pageId,
            type: option.type,
            pos_x: offsetX,
            pos_y: offsetY,
            width: option.defaultWidth,
            height: option.defaultHeight,
        });
    };

    return (
        <div className="absolute bottom-6 right-6 z-50" ref={menuRef}>
            {/* Popover menu */}
            {isOpen && (
                <div className="absolute bottom-14 right-0 bg-card border border-border rounded-lg shadow-xl p-2 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1.5">
                        Add Block
                    </p>
                    {BLOCK_OPTIONS.map((option) => (
                        <button
                            key={option.type}
                            onClick={() => handleAdd(option)}
                            disabled={addBlock.isPending}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"
                        >
                            <span className="text-primary">{option.icon}</span>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {/* FAB button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isOpen ? 'rotate-45' : ''}`}
            >
                <FaPlus size={18} />
            </button>
        </div>
    );
}
