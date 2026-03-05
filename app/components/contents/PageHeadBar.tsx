export default function PageHeadBar() {
    const mockData = {
        name: "Workspace Overview",
        background_img: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2275&auto=format&fit=crop",
        icon_img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=3276&auto=format&fit=crop",
    }

    return (
        <div className="w-full flex-shrink-0 relative">
            {/* Cover Image */}
            <div
                className="w-full h-64 bg-default-medium bg-cover bg-center"
                style={{ backgroundImage: `url(${mockData.background_img})` }}
            />

            {/* Container for Icon & Title */}
            <div className="max-w-5xl mx-auto px-12 relative pb-8">
                {/* Page Icon Container - Overlaps the cover image slightly */}
                <div className="-mt-16 mb-4 relative z-10">
                    <img
                        src={mockData.icon_img}
                        className="w-32 h-32 rounded-full border-4 border-background shadow-md object-cover bg-background"
                        alt="Page Icon"
                    />
                </div>

                {/* Page Title */}
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight outline-none" contentEditable suppressContentEditableWarning>
                    {mockData.name}
                </h1>
            </div>
        </div>
    )
}