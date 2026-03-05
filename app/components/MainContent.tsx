import SideBar from "./SideBar";
import PageContentRenderer, { PageBlock } from "./PageContentRenderer";

export default function MainContent() {
    // Temporary mock data mapping to the new absolute positioning DB schema
    const mockBlocks: PageBlock[] = [
        { id: "2", page_id: "demo", type: "BOARD", pos_x: 440, pos_y: 20, width: 600, height: 400, z_index: 1 },
        { id: "3", page_id: "demo", type: "CALENDAR", pos_x: 20, pos_y: 340, width: 400, height: 300, z_index: 1 },
        { id: "4", page_id: "demo", type: "LINK", pos_x: 1060, pos_y: 20, width: 200, height: 100, z_index: 1 },
    ];

    return (
        <>
            <div className="flex flex-1 overflow-hidden w-full flex-row">
                <SideBar />
                <PageContentRenderer blocks={mockBlocks} />
            </div>
        </>
    )
}