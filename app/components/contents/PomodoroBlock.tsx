"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const MODES: Record<PomodoroMode, { label: string; minutes: number; color: string }> = {
    work: { label: "Focus", minutes: 25, color: "text-primary" },
    shortBreak: { label: "Short Break", minutes: 5, color: "text-emerald-400" },
    longBreak: { label: "Long Break", minutes: 15, color: "text-blue-400" },
};

// ─── LocalStorage Helper ─────────────
type TimerState = {
    mode: PomodoroMode;
    secondsLeft: number;
    isRunning: boolean;
    startedAt: number | null; // Date.now() when timer was started
};

function getSavedTimer(blockId: string): TimerState {
    if (typeof window === "undefined") {
        return { mode: "work", secondsLeft: MODES.work.minutes * 60, isRunning: false, startedAt: null };
    }
    const saved = localStorage.getItem(`pomodoro_${blockId}`);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) { }
    }
    return { mode: "work", secondsLeft: MODES.work.minutes * 60, isRunning: false, startedAt: null };
}

function saveTimer(blockId: string, state: TimerState) {
    if (typeof window !== "undefined") {
        localStorage.setItem(`pomodoro_${blockId}`, JSON.stringify(state));
    }
}
// ────────────────────────────────────────────────────────────────────

interface PomodoroBlockProps {
    blockId: string;
}

export default function PomodoroBlock({ blockId }: PomodoroBlockProps) {
    // Restore from global store, accounting for elapsed time if running
    const initState = useCallback(() => {
        const saved = getSavedTimer(blockId);
        if (saved.isRunning && saved.startedAt) {
            const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
            const remaining = Math.max(0, saved.secondsLeft - elapsed);
            return { ...saved, secondsLeft: remaining, isRunning: remaining > 0 };
        }
        return saved;
    }, [blockId]);

    const [mode, setMode] = useState<PomodoroMode>("work");
    const [secondsLeft, setSecondsLeft] = useState(MODES.work.minutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const state = initState();
        setMode(state.mode);
        setSecondsLeft(state.secondsLeft);
        setIsRunning(state.isRunning);
        setIsLoaded(true);
    }, [initState]);

    const totalSeconds = MODES[mode].minutes * 60;
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

    // Persist to localStore on every change
    useEffect(() => {
        if (!isLoaded) return;
        saveTimer(blockId, {
            mode,
            secondsLeft,
            isRunning,
            startedAt: isRunning ? Date.now() : null,
        });
    }, [mode, secondsLeft, isRunning, blockId, isLoaded]);

    // Timer tick - simplified to just handle secondsLeft internally!
    useEffect(() => {
        if (isRunning && secondsLeft > 0) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((s) => {
                    const next = s - 1;
                    if (next <= 0) {
                        setIsRunning(false);
                        return 0;
                    }
                    return next;
                });
            }, 1000);
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
