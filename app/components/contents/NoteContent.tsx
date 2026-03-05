export default function NoteContent() {
    const mockData = {
        name: "Page Title",
        background_img: "https://images.unsplash.com/photo-1506748786380-4e727fd4d951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        icon_img: "https://images.unsplash.com/photo-1506748786380-4e727fd4d951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.Quaerat, incidunt.Eveniet veritatis quaerat voluptates quo fugit! Sequi esse optio necessitatibus, quas ipsa earum omnis beatae illo eius aut.Consectetur, voluptates!"
    }

    return (
        <div className="flex-1 overflow-hidden">
            <div className="relative h-48 w-full">
                <img src={mockData.background_img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
            </div>
            <div className="px-8 -mt-16 relative z-10 flex items-center gap-4">
                <img
                    src={mockData.icon_img}
                    alt=""
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
                <h1 className="text-4xl font-bold">{mockData.name}</h1>
            </div>
            <div className="px-8">
                <p>{mockData.content}</p>
            </div>
        </div>
    )
}