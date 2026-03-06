"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarBlock() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (day: number) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    return (
        <div className="h-full w-full flex flex-col bg-card overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
                <button onClick={prevMonth} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <FaChevronLeft size={10} />
                </button>
                <span className="text-xs font-semibold text-foreground">
                    {MONTHS[month]} {year}
                </span>
                <button onClick={nextMonth} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <FaChevronRight size={10} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border flex-shrink-0">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {cells.map((day, i) => (
                    <div
                        key={i}
                        className={`flex items-center justify-center text-xs border-b border-r border-border/30
                            ${day ? 'text-foreground hover:bg-accent/50 cursor-pointer transition-colors' : ''}
                            ${day && isToday(day) ? 'bg-primary text-primary-foreground font-bold rounded-sm' : ''}
                        `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
