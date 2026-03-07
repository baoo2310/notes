"use client";

import { trpc } from "@/utils/trpc";
import { FaUsers, FaFolder, FaFileAlt } from "react-icons/fa";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery();
    const { data: users, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery();

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground mt-1">Overview of your application</p>
                    </div>
                    <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors">← Back to App</Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={<FaUsers />} label="Total Users" value={stats?.users} loading={statsLoading} />
                    <StatCard icon={<FaFolder />} label="Workspaces" value={stats?.workspaces} loading={statsLoading} />
                    <StatCard icon={<FaFileAlt />} label="Pages" value={stats?.pages} loading={statsLoading} />
                </div>

                {/* Users table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                        <h2 className="font-semibold text-foreground">All Users</h2>
                    </div>
                    {usersLoading ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="px-5 py-3 font-medium text-muted-foreground">User</th>
                                        <th className="px-5 py-3 font-medium text-muted-foreground">Email</th>
                                        <th className="px-5 py-3 font-medium text-muted-foreground">Role</th>
                                        <th className="px-5 py-3 font-medium text-muted-foreground">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.map((user) => (
                                        <tr key={user.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <img src={user.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-foreground">{user.name || "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, loading }: { icon: React.ReactNode; label: string; value?: number; loading: boolean }) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                {loading ? (
                    <div className="h-7 w-12 bg-accent animate-pulse rounded mt-1" />
                ) : (
                    <p className="text-2xl font-bold text-foreground">{value ?? 0}</p>
                )}
            </div>
        </div>
    );
}
