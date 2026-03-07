"use client";

import { useState, useEffect } from "react";

export default function ClockBlock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Analog clock angles
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const secondAngle = seconds * 6;

    const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const formattedDate = time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

    return (
        <div className="h-full w-full flex flex-col bg-card items-center justify-center p-4 gap-3">
            {/* Analog clock */}
            <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Clock face */}
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
                    {/* Hour markers */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = i * 30 - 90;
                        const rad = (angle * Math.PI) / 180;
                        const x1 = 50 + 40 * Math.cos(rad);
                        const y1 = 50 + 40 * Math.sin(rad);
                        const x2 = 50 + 44 * Math.cos(rad);
                        const y2 = 50 + 44 * Math.sin(rad);
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />;
                    })}
                    {/* Hour hand */}
                    <line
                        x1="50" y1="50"
                        x2={50 + 24 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
                        y2={50 + 24 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
                        stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-foreground"
                    />
                    {/* Minute hand */}
                    <line
                        x1="50" y1="50"
                        x2={50 + 32 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
                        y2={50 + 32 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground"
                    />
                    {/* Second hand */}
                    <line
                        x1="50" y1="50"
                        x2={50 + 36 * Math.cos(((secondAngle - 90) * Math.PI) / 180)}
                        y2={50 + 36 * Math.sin(((secondAngle - 90) * Math.PI) / 180)}
                        stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-primary"
                    />
                    {/* Center dot */}
                    <circle cx="50" cy="50" r="2.5" fill="currentColor" className="text-primary" />
                </svg>
            </div>

            {/* Digital time */}
            <div className="text-center">
                <p className="text-2xl font-bold text-foreground font-mono">{formattedTime}</p>
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
            </div>
        </div>
    );
}
