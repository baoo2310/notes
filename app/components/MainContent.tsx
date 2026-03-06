"use client";

import SideBar from "./SideBar";
import PageContentRenderer, { PageBlock } from "./PageContentRenderer";
import { usePage } from "../context/PageContext";
import { trpc } from "@/utils/trpc";

export default function MainContent() {
    const { selectedPageId } = usePage();

    const { data: pageData } = trpc.page.getById.useQuery(
        { id: selectedPageId! },
        { enabled: !!selectedPageId }
    );

    // Map DB blocks to the component's expected shape
    const blocks: PageBlock[] = (pageData?.blocks ?? []).map((b: any) => ({
        id: b.id,
        page_id: b.page_id,
        type: b.type,
        pos_x: b.pos_x,
        pos_y: b.pos_y,
        width: b.width,
        height: b.height,
        z_index: b.z_index,
        content: b.content,
    }));

    const page = pageData ? {
        id: pageData.id,
        name: pageData.name,
        icon_img: pageData.icon_img,
        background_img: pageData.background_img,
    } : null;

    return (
        <>
            <div className="flex flex-1 overflow-hidden w-full flex-row">
                <SideBar />
                <PageContentRenderer page={page} blocks={blocks} />
            </div>
        </>
    );
}