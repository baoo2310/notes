import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./types";

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
}

export default function TaskCard({ task, isOverlay }: TaskCardProps) {
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
            className={`bg-neutral-primary p-3 rounded-md shadow-sm border border-default-medium text-body cursor-grab hover:border-brand/50 ${isOverlay ? "rotate-2 scale-105 shadow-md border-brand/50 cursor-grabbing" : ""
                }`}
        >
            <p className="text-sm whitespace-pre-wrap">{task.content}</p>
        </div>
    );
}
