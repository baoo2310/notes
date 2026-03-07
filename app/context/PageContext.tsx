"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PageContextType {
    workspaceId: string | null;
    setWorkspaceId: (id: string | null) => void;
    selectedPageId: string | null;
    setSelectedPageId: (id: string | null) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

    return (
        <PageContext.Provider value={{
            workspaceId,
            setWorkspaceId,
            selectedPageId,
            setSelectedPageId,
        }}>
            {children}
        </PageContext.Provider>
    );
}

export function usePage() {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error("usePage must be used within a PageProvider");
    }
    return context;
}
