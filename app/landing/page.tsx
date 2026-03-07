import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { RiTrelloFill } from "react-icons/ri";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Nav */}
            <nav className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <RiTrelloFill className="text-primary text-2xl" />
                    <span className="text-xl font-bold text-foreground">Notes App</span>
                </div>
                <SignInButton />
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                            Your ideas,<br />
                            <span className="text-primary">organized beautifully.</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            A modern workspace to capture notes, manage projects with Kanban boards, track time with Pomodoro timers, and keep everything in one place.
                        </p>
                    </div>

                    <SignInButton size="lg" />

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                        <FeatureCard emoji="📝" title="Notes" desc="Write and organize your thoughts with a clean editor." />
                        <FeatureCard emoji="📋" title="Kanban Boards" desc="Manage tasks visually with drag-and-drop columns." />
                        <FeatureCard emoji="🍅" title="Pomodoro Timer" desc="Stay focused with built-in productivity timers." />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-muted-foreground">
                Built with Next.js, tRPC & Drizzle ORM
            </footer>
        </div>
    );
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 text-left hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{emoji}</div>
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
        </div>
    );
}

function SignInButton({ size = "default" }: { size?: "default" | "lg" }) {
    const isLg = size === "lg";
    return (
        <form action={async () => {
            "use server";
            const { signIn } = await import("@/auth");
            await signIn("github", { redirectTo: "/" });
        }}>
            <button
                type="submit"
                className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20
                    ${isLg ? "px-8 py-3.5 text-base" : "px-5 py-2.5 text-sm"}`}
            >
                <FaGithub className={isLg ? "text-xl" : "text-base"} />
                Sign in with GitHub
            </button>
        </form>
    );
}
