"use client";

import { useState } from "react";

export default function NoteBlock() {
    const [content, setContent] = useState("");

    return (
        <div className="h-full w-full flex flex-col bg-card">
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Note</span>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your note..."
                className="flex-1 w-full p-3 bg-transparent text-foreground text-sm resize-none focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed"
            />
        </div>
    );
}
