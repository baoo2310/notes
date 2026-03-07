"use client";

import SideBar from "./SideBar";
import PageContentRenderer, { PageBlock } from "./PageContentRenderer";
import { usePage } from "../context/PageContext";
import { trpc } from "@/utils/trpc";

export default function MainContent() {
    const { selectedPageId } = usePage();

    const { data: pageData, error, isLoading } = trpc.page.getById.useQuery(
        { id: selectedPageId! },
        { enabled: !!selectedPageId }
    );

    if (error) {
        console.error("page.getById error:", error.message);
    }

    // Map DB blocks to the component's expected shape
    const blocks: PageBlock[] = (pageData?.blocks ?? []).map((b: any) => ({
        id: b.id,
        page_id: b.page_id,
        type: b.type,
        order: b.order ?? 0,
        content: b.content,
    }));

    const page = pageData ? {
        id: pageData.id,
        name: pageData.name,
        icon_img: pageData.icon_img,
        background_img: pageData.background_img,
    } : null;

    const childPages = (pageData as any)?.childPages?.map((c: any) => ({
        id: c.id,
        name: c.name,
        icon_img: c.icon_img,
    })) ?? [];

    return (
        <>
            <div className="flex flex-1 overflow-hidden w-full flex-row">
                <SideBar />
                <PageContentRenderer page={page} blocks={blocks} childPages={childPages} />
            </div>
        </>
    );
}