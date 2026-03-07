"use client";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "loading") {
        return <div className="w-8 h-8 rounded-full bg-accent animate-pulse" />;
    }

    if (!session?.user) {
        return (
            <button
                onClick={() => signIn("github")}
                className="text-sm font-medium text-primary-foreground bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
                Sign In
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center focus:outline-none transition-colors"
                type="button"
            >
                {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-primary transition-all" />
                ) : (
                    <FaUserCircle size={32} className="text-primary hover:text-primary/80 transition-colors" />
                )}
            </button>
            {/* Dropdown menu */}
            <div className={`absolute right-0 top-full mt-2 z-10 ${isOpen ? 'block' : 'hidden'} bg-card border border-border rounded-md shadow-lg w-64`}>
                <div className="p-3 border-b border-border">
                    <div className="text-sm text-foreground">
                        <div className="font-semibold">{session.user.name}</div>
                        <div className="truncate text-muted-foreground">{session.user.email}</div>
                    </div>
                </div>
                <ul className="py-2 text-sm text-foreground" aria-labelledby="dropdownInformationButton">
                    <li>
                        <a href="#" className="inline-flex items-center w-full px-4 py-2 hover:bg-accent transition-all">
                            Settings
                        </a>
                    </li>
                    <li className="border-t border-border mt-2 pt-2">
                        <button
                            onClick={() => signOut()}
                            className="inline-flex items-center w-full px-4 py-2 text-destructive hover:bg-accent transition-all text-left"
                        >
                            Sign out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}