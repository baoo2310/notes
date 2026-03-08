import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id, Task } from "./types";
import { FaTrash } from "react-icons/fa";

interface TaskCardProps {
    task: Task;
    deleteTask: (id: Id) => void;
    isOverlay?: boolean;
}

export default function TaskCard({ task, deleteTask, isOverlay }: TaskCardProps) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-default-medium opacity-50 p-3 min-h-[64px] rounded-md border-2 border-brand cursor-grab relative"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-neutral-primary p-3 rounded-md shadow-sm border border-default-medium text-body cursor-grab hover:border-brand/50 group flex justify-between items-start gap-2 ${isOverlay ? "rotate-2 scale-105 shadow-md border-brand/50 cursor-grabbing" : ""
                }`}
        >
            <p className="text-sm whitespace-pre-wrap">{task.content}</p>
            <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-all text-default-medium hover:bg-red-100 hover:text-red-500 rounded-full p-2"
                onPointerDown={(e) => e.stopPropagation()}
                title="Delete task"
            >
                <FaTrash size={12} />
            </button>
        </div>
    );
}
