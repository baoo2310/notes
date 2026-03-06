"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Hardcoded workspace ID until auth is implemented.
// Replace this with a real ID from your DB or set NEXT_PUBLIC_WORKSPACE_ID in .env
const DEFAULT_WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID ?? "00000000-0000-0000-0000-000000000000";

interface PageContextType {
    workspaceId: string;
    selectedPageId: string | null;
    setSelectedPageId: (id: string | null) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

    return (
        <PageContext.Provider value={{
            workspaceId: DEFAULT_WORKSPACE_ID,
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
