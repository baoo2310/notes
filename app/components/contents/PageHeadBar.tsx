interface PageHeadBarProps {
    page?: {
        name: string;
        background_img?: string | null;
        icon_img?: string | null;
    } | null;
}

export default function PageHeadBar({ page }: PageHeadBarProps) {
    if (!page) {
        return (
            <div className="w-full flex-shrink-0 h-48 bg-accent/20 flex items-center justify-center">
                <p className="text-muted-foreground text-lg">Select a page from the sidebar</p>
            </div>
        );
    }

    return (
        <div className="w-full flex-shrink-0 relative">
            {/* Cover Image */}
            <div
                className="w-full h-48 bg-accent bg-cover bg-center"
                style={page.background_img ? { backgroundImage: `url(${page.background_img})` } : undefined}
            />

            {/* Container for Icon & Title */}
            <div className="max-w-5xl mx-auto px-12 relative pb-8">
                {/* Page Icon */}
                {page.icon_img ? (
                    <div className="-mt-12 mb-4 relative z-10">
                        <img
                            src={page.icon_img}
                            className="w-24 h-24 rounded-full border-4 border-background shadow-md object-cover bg-background"
                            alt="Page Icon"
                        />
                    </div>
                ) : (
                    <div className="-mt-12 mb-4 relative z-10">
                        <div className="w-24 h-24 rounded-full border-4 border-background shadow-md bg-accent flex items-center justify-center text-3xl">
                            📄
                        </div>
                    </div>
                )}

                {/* Page Title */}
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                    {page.name}
                </h1>
            </div>
        </div>
    );
}