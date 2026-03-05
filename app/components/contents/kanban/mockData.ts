import { Column, Task } from "./types";

export const defaultCols: Column[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
];

export const defaultTasks: Task[] = [
    { id: "1", columnId: "todo", content: "Design database schema" },
    { id: "2", columnId: "todo", content: "Write API endpoints" },
    { id: "3", columnId: "in-progress", content: "Implement drag and drop" },
    { id: "4", columnId: "done", content: "Set up Next.js app" },
];
