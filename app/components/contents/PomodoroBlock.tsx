"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const MODES: Record<PomodoroMode, { label: string; minutes: number; color: string }> = {
    work: { label: "Focus", minutes: 25, color: "text-primary" },
    shortBreak: { label: "Short Break", minutes: 5, color: "text-emerald-400" },
    longBreak: { label: "Long Break", minutes: 15, color: "text-blue-400" },
};

// ─── Global state store so timer survives page switches ─────────────
type TimerState = {
    mode: PomodoroMode;
    secondsLeft: number;
    isRunning: boolean;
    startedAt: number | null; // Date.now() when timer was started
};

const globalTimers = new Map<string, TimerState>();

function getOrCreateTimer(blockId: string): TimerState {
    if (!globalTimers.has(blockId)) {
        globalTimers.set(blockId, {
            mode: "work",
            secondsLeft: MODES.work.minutes * 60,
            isRunning: false,
            startedAt: null,
        });
    }
    return globalTimers.get(blockId)!;
}

// ────────────────────────────────────────────────────────────────────

interface PomodoroBlockProps {
    blockId: string;
}

export default function PomodoroBlock({ blockId }: PomodoroBlockProps) {
    // Restore from global store, accounting for elapsed time if running
    const initState = useCallback(() => {
        const saved = getOrCreateTimer(blockId);
        if (saved.isRunning && saved.startedAt) {
            const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
            const remaining = Math.max(0, saved.secondsLeft - elapsed);
            return { ...saved, secondsLeft: remaining, isRunning: remaining > 0 };
        }
        return saved;
    }, [blockId]);

    const [mode, setMode] = useState<PomodoroMode>(() => initState().mode);
    const [secondsLeft, setSecondsLeft] = useState(() => initState().secondsLeft);
    const [isRunning, setIsRunning] = useState(() => initState().isRunning);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const totalSeconds = MODES[mode].minutes * 60;
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

    // Persist to global store on every change
    useEffect(() => {
        globalTimers.set(blockId, {
            mode,
            secondsLeft,
            isRunning,
            startedAt: isRunning ? Date.now() : null,
        });
    }, [mode, secondsLeft, isRunning, blockId]);

    // Timer tick
    useEffect(() => {
        if (isRunning && secondsLeft > 0) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((s) => {
                    if (s <= 1) {
                        setIsRunning(false);
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, secondsLeft]);

    const switchMode = (m: PomodoroMode) => {
        setMode(m);
        setSecondsLeft(MODES[m].minutes * 60);
        setIsRunning(false);
    };

    const reset = () => {
        setSecondsLeft(MODES[mode].minutes * 60);
        setIsRunning(false);
    };

    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const secs = String(secondsLeft % 60).padStart(2, "0");

    return (
        <div className="h-full w-full flex flex-col bg-card items-center justify-center p-4 gap-3">
            {/* Mode tabs */}
            <div className="flex gap-1 bg-accent/50 rounded-lg p-0.5">
                {(Object.keys(MODES) as PomodoroMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                            ${mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {MODES[m].label}
                    </button>
                ))}
            </div>

            {/* Timer display with circular progress */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-accent" />
                    <circle
                        cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4"
                        className={MODES[mode].color}
                        strokeDasharray={`${2 * Math.PI * 44}`}
                        strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.5s ease" }}
                    />
                </svg>
                <span className={`text-3xl font-bold ${MODES[mode].color} font-mono`}>
                    {mins}:{secs}
                </span>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-5 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {isRunning ? "Pause" : "Start"}
                </button>
                <button
                    onClick={reset}
                    className="px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
