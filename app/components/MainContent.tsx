import SideBar from "./SideBar";
import PageContentRenderer, { PageBlock } from "./PageContentRenderer";

export default function MainContent() {
    // Mocking a page full of blocks
    const mockBlocks: PageBlock[] = [
        { id: "1", type: "NOTE", position_order: 1, position_col: "full", size: "medium" },
        { id: "2", type: "CALENDAR", position_order: 2, position_col: "left", size: "small" },
        { id: "3", type: "LINK", position_order: 3, position_col: "right", size: "small" },
        { id: "4", type: "BOARD", position_order: 4, position_col: "full", size: "large" },
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