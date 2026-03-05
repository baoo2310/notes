import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "./types";
import TaskCard from "./TaskCard";

interface ColumnProps {
    column: Column;
    tasks: Task[];
}

export default function BoardColumn({ column, tasks }: ColumnProps) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const tasksIds = tasks.map((t) => t.id);

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-brand/10 w-72 h-[500px] border-2 border-brand rounded-lg flex flex-col"
            ></div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-neutral-secondary w-72 h-[500px] rounded-lg flex flex-col p-2 overflow-hidden shadow-sm border border-default-medium flex-shrink-0"
        >
            <div
                {...attributes}
                {...listeners}
                className="bg-neutral-primary p-3 font-semibold text-heading text-sm rounded-md mb-2 flex items-center justify-between cursor-grab border border-transparent shadow-sm"
            >
                <div className="flex gap-2 items-center">
                    {column.title}
                    <span className="flex justify-center items-center bg-default-medium text-body text-xs rounded-full p-1 w-5 h-5">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-grow overflow-y-auto p-1">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
