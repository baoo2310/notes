"use client";

import { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaLink } from "react-icons/fa";
import { trpc } from "@/utils/trpc";

interface LinkBlockProps {
    blockId: string;
    initialContent?: any;
}

export default function LinkBlock({ blockId, initialContent }: LinkBlockProps) {
    const [url, setUrl] = useState(initialContent?.url || "");
    const [saved, setSaved] = useState(!!initialContent?.url);

    const updateContent = trpc.page.updateBlockContent.useMutation();

    const handleSave = () => {
        if (url.trim()) {
            setSaved(true);
            updateContent.mutate({ id: blockId, content: { url: url.trim() } });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
    };

    const getDomain = (u: string) => {
        try {
            return new URL(u.startsWith("http") ? u : `https://${u}`).hostname;
        } catch {
            return u;
        }
    };

    const getFullUrl = (u: string) => (u.startsWith("http") ? u : `https://${u}`);

    if (saved && url.trim()) {
        return (
            <div className="h-full w-full flex flex-col bg-card">
                <div className="px-3 py-1.5 border-b border-border flex items-center gap-2 flex-shrink-0">
                    <FaLink className="text-muted-foreground" size={10} />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link</span>
                </div>
                <a
                    href={getFullUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 p-4 hover:bg-accent/30 transition-colors group"
                >
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FaExternalLinkAlt className="text-primary" size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {getDomain(url)}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">{url}</span>
                    </div>
                </a>
                <button
                    onClick={() => setSaved(false)}
                    className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 border-t border-border transition-colors"
                >
                    Edit URL
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-card">
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-2 flex-shrink-0">
                <FaLink className="text-muted-foreground" size={10} />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3 w-full max-w-[220px]">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste a URL..."
                        className="w-full px-3 py-2 text-sm bg-transparent border border-border rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                        onClick={handleSave}
                        disabled={!url.trim()}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Save Link
                    </button>
                </div>
            </div>
        </div>
    );
}
