"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { trpc } from "@/utils/trpc";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy } from "@dnd-kit/sortable";

import { Column, Id, Task } from "./types";
import { defaultCols, defaultTasks } from "./mockData";
import TaskCard from "./TaskCard";
import BoardColumn from "./BoardColumn";

export default function KanbanBoard({ blockId, initialContent }: { blockId: string; initialContent?: any }) {
    const [columns, setColumns] = useState<Column[]>(initialContent?.columns || defaultCols);
    const [tasks, setTasks] = useState<Task[]>(initialContent?.tasks || defaultTasks);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Sync local state when parent props change (e.g., after React Query invalidation and refetch)
    useEffect(() => {
        if (initialContent) {
            setColumns(initialContent.columns || defaultCols);
            setTasks(initialContent.tasks || defaultTasks);
        }
    }, [initialContent]);

    const trpcUtils = trpc.useUtils();
    const updateContent = trpc.page.updateBlockContent.useMutation();
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveState = (newColumns: Column[], newTasks: Task[], immediate = false) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        const doSave = () => {
            console.log("Saving Kanban State!", { columns: newColumns, tasks: newTasks });
            updateContent.mutate({
                id: blockId,
                content: { columns: newColumns, tasks: newTasks },
            }, {
                onError: (err) => console.error("Failed to save Kanban state:", err),
                onSuccess: () => {
                    console.log("Kanban state saved!")
                    trpcUtils.page.getById.invalidate();
                }
            });
        };

        if (immediate) {
            doSave();
        } else {
            saveTimeoutRef.current = setTimeout(doSave, 500);
        }
    };

    const deleteTask = (id: Id) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
        saveState(columns, newTasks, true);
    };

    const addTask = (columnId: Id, content: string) => {
        const newTask: Task = {
            id: Date.now().toString(),
            columnId,
            content,
        };
        const newTasks = [...tasks, newTask];
        setTasks(newTasks);
        saveState(columns, newTasks, true);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Enable click vs drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columnsId = columns.map((col) => col.id);

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";
        const isOverColumn = over.data.current?.type === "Column";

        if (!isActiveTask) return;

        // Im dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                let newTasks: Task[];

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    newTasks = [...tasks];
                    newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                    newTasks = arrayMove(newTasks, activeIndex, overIndex - 1);
                } else {
                    newTasks = arrayMove(tasks, activeIndex, overIndex);
                }

                saveState(columns, newTasks);
                return newTasks;
            });
        }

        // Im dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                let newTasks = [...tasks];
                newTasks[activeIndex].columnId = overId;
                newTasks = arrayMove(newTasks, activeIndex, activeIndex); // keeps it at same index but swaps col

                saveState(columns, newTasks);
                return newTasks;
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        // Always flush save when a drag ends to clear the 500ms timeout 
        // and guarantee immediate persistence before unmounts.
        saveState(columns, tasks, true);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveColumn = active.data.current?.type === "Column";
        if (isActiveColumn) {
            setColumns(columns => {
                const activeColIndex = columns.findIndex(col => col.id === activeId);
                const overColIndex = columns.findIndex(col => col.id === overId);
                const newCols = arrayMove(columns, activeColIndex, overColIndex);
                saveState(newCols, tasks, true);
                return newCols;
            })
        }
    }

    return (
        <div className="h-full w-full flex items-start justify-center overflow-x-auto p-4 gap-4 bg-background">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-4">
                    <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                        {columns.map((col) => (
                            <BoardColumn
                                key={col.id}
                                column={col}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                deleteTask={deleteTask}
                                addTask={addTask}
                            />
                        ))}
                    </SortableContext>
                </div>

                {typeof document !== 'undefined' && createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                column={activeColumn}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                deleteTask={deleteTask}
                                addTask={addTask}
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} isOverlay />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
