"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
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

import { Column, Task } from "./types";
import { defaultCols, defaultTasks } from "./mockData";
import TaskCard from "./TaskCard";
import BoardColumn from "./BoardColumn";

export default function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>(defaultTasks);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

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

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(newTasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        // Im dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const newTasks = [...tasks];
                newTasks[activeIndex].columnId = overId;
                return arrayMove(newTasks, activeIndex, activeIndex); // keeps it at same index but swaps col
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

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
                return arrayMove(columns, activeColIndex, overColIndex);
            })
        }
    }

    return (
        <div className="h-full w-full flex items-start overflow-x-auto p-4 gap-4 bg-background">
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
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} isOverlay />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
