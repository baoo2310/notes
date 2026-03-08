import { useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Id, Task } from "./types";
import { FaPlus } from "react-icons/fa";
import TaskCard from "./TaskCard";

interface ColumnProps {
    column: Column;
    tasks: Task[];
    deleteTask: (id: Id) => void;
    addTask: (columnId: Id, content: string) => void;
}

export default function BoardColumn({ column, tasks, deleteTask, addTask }: ColumnProps) {
    const [newTaskContent, setNewTaskContent] = useState("");
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
                <div className="flex gap-2 items-center flex-grow">
                    {column.title}
                    <span className="flex justify-center items-center bg-default-medium text-body text-xs rounded-full p-1 w-5 h-5">
                        {tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        onKeyDown={(e) => {
                            e.stopPropagation(); // Prevent dnd-kit from eating the Spacebar!
                            if (e.key === "Enter" && newTaskContent.trim()) {
                                addTask(column.id, newTaskContent.trim());
                                setNewTaskContent("");
                            }
                        }}
                        placeholder="Task title..."
                        className="w-24 text-xs px-2 py-1 bg-background border border-border rounded focus:outline-none focus:border-brand"
                    />
                    <button
                        onClick={() => {
                            if (newTaskContent.trim()) {
                                addTask(column.id, newTaskContent.trim());
                                setNewTaskContent("");
                            }
                        }}
                        disabled={!newTaskContent.trim()}
                        className="p-1 rounded-md text-default-medium hover:text-brand hover:bg-default-medium/50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        title="Add task"
                    >
                        <FaPlus size={14} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-grow overflow-y-auto p-1">
                <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
