"use client";

import { useState, useRef, useEffect } from "react";
import { FaCamera, FaPen } from "react-icons/fa";
import { trpc } from "@/utils/trpc";

interface PageHeadBarProps {
    page?: {
        id: string;
        name: string;
        background_img?: string | null;
        icon_img?: string | null;
    } | null;
}

export default function PageHeadBar({ page }: PageHeadBarProps) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [title, setTitle] = useState(page?.name ?? "");
    const [showBgInput, setShowBgInput] = useState(false);
    const [bgUrl, setBgUrl] = useState(page?.background_img ?? "");
    const [showIconInput, setShowIconInput] = useState(false);
    const [iconUrl, setIconUrl] = useState(page?.icon_img ?? "");
    const titleRef = useRef<HTMLInputElement>(null);
    const trpcUtils = trpc.useUtils();

    const updatePage = trpc.page.updatePage.useMutation({
        onSuccess: () => {
            if (page) {
                trpcUtils.page.getById.invalidate({ id: page.id });
                trpcUtils.page.getAll.invalidate();
            }
        },
    });

    // Sync local state when page changes
    useEffect(() => {
        setTitle(page?.name ?? "");
        setBgUrl(page?.background_img ?? "");
        setIconUrl(page?.icon_img ?? "");
    }, [page?.id, page?.name, page?.background_img, page?.icon_img]);

    // Focus title input when editing
    useEffect(() => {
        if (editingTitle && titleRef.current) titleRef.current.focus();
    }, [editingTitle]);

    if (!page) {
        return (
            <div className="w-full flex-shrink-0 h-48 bg-accent/20 flex items-center justify-center">
                <p className="text-muted-foreground text-lg">Select a page from the sidebar</p>
            </div>
        );
    }

    const saveTitle = () => {
        setEditingTitle(false);
        if (title.trim() && title !== page.name) {
            updatePage.mutate({ id: page.id, name: title.trim() });
        }
    };

    const saveBg = () => {
        setShowBgInput(false);
        const val = bgUrl.trim() || null;
        if (val !== (page.background_img ?? null)) {
            updatePage.mutate({ id: page.id, background_img: val });
        }
    };

    const saveIcon = () => {
        setShowIconInput(false);
        const val = iconUrl.trim() || null;
        if (val !== (page.icon_img ?? null)) {
            updatePage.mutate({ id: page.id, icon_img: val });
        }
    };

    return (
        <div className="w-full flex-shrink-0 relative">
            {/* Cover Image */}
            <div
                className="w-full h-48 bg-accent bg-cover bg-center relative group cursor-pointer"
                style={page.background_img ? { backgroundImage: `url(${page.background_img})` } : undefined}
                onClick={() => setShowBgInput(!showBgInput)}
            >
                {/* Change cover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-md">
                        <FaCamera size={10} />
                        {page.background_img ? "Change cover" : "Add cover"}
                    </span>
                </div>
            </div>

            {/* Background URL Input */}
            {showBgInput && (
                <div className="absolute top-48 left-0 right-0 z-20 bg-card border-b border-border p-3 shadow-lg">
                    <div className="max-w-5xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={bgUrl}
                            onChange={(e) => setBgUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveBg()}
                            placeholder="Paste cover image URL..."
                            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            autoFocus
                        />
                        <button onClick={saveBg} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Save</button>
                        <button onClick={() => setShowBgInput(false)} className="px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors">Cancel</button>
                        {page.background_img && (
                            <button
                                onClick={() => { updatePage.mutate({ id: page.id, background_img: null }); setShowBgInput(false); setBgUrl(""); }}
                                className="px-3 py-2 text-sm text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                            >Remove</button>
                        )}
                    </div>
                </div>
            )}

            {/* Container for Icon & Title */}
            <div className="max-w-5xl mx-auto px-12 relative pb-8">
                {/* Page Icon */}
                <div className="-mt-12 mb-4 relative z-10 group cursor-pointer" onClick={() => setShowIconInput(!showIconInput)}>
                    {page.icon_img ? (
                        <div className="relative">
                            <img
                                src={page.icon_img}
                                className="w-24 h-24 rounded-full border-4 border-background shadow-md object-cover bg-background"
                                alt="Page Icon"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-full flex items-center justify-center">
                                <FaPen className="opacity-0 group-hover:opacity-100 text-white transition-opacity" size={12} />
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full border-4 border-background shadow-md bg-accent flex items-center justify-center text-3xl group-hover:bg-accent/80 transition-colors">
                            📄
                        </div>
                    )}
                </div>

                {/* Icon URL Input */}
                {showIconInput && (
                    <div className="mb-4 bg-card border border-border rounded-lg p-3 shadow-lg z-20 relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={iconUrl}
                                onChange={(e) => setIconUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveIcon()}
                                placeholder="Paste icon image URL..."
                                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                autoFocus
                            />
                            <button onClick={saveIcon} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Save</button>
                            <button onClick={() => setShowIconInput(false)} className="px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors">Cancel</button>
                            {page.icon_img && (
                                <button
                                    onClick={() => { updatePage.mutate({ id: page.id, icon_img: null }); setShowIconInput(false); setIconUrl(""); }}
                                    className="px-3 py-2 text-sm text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                                >Remove</button>
                            )}
                        </div>
                    </div>
                )}

                {/* Page Title — click to edit */}
                {editingTitle ? (
                    <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                        className="text-4xl font-extrabold text-foreground tracking-tight bg-transparent border-none outline-none w-full focus:ring-0"
                    />
                ) : (
                    <h1
                        onClick={() => setEditingTitle(true)}
                        className="text-4xl font-extrabold text-foreground tracking-tight cursor-text hover:bg-accent/30 rounded-md px-1 -ml-1 transition-colors"
                        title="Click to edit title"
                    >
                        {page.name}
                    </h1>
                )}
            </div>
        </div>
    );
}