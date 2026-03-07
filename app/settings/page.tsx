"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft, FaTrash, FaPen, FaCheck, FaTimes } from "react-icons/fa";

export default function SettingsPage() {
    const { data: session } = useSession();
    const { data: profile, isLoading } = trpc.settings.getProfile.useQuery();
    const { data: workspaces } = trpc.workspace.getAll.useQuery();
    const trpcUtils = trpc.useUtils();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [nameInit, setNameInit] = useState(false);

    // Initialize form when profile loads
    if (profile && !nameInit) {
        setName(profile.name || "");
        setBio(profile.bio || "");
        setNameInit(true);
    }

    const updateProfile = trpc.settings.updateProfile.useMutation({
        onSuccess: () => {
            trpcUtils.settings.getProfile.invalidate();
        },
    });

    const renameWorkspace = trpc.workspace.update.useMutation({
        onSuccess: () => trpcUtils.workspace.getAll.invalidate(),
    });

    const deleteWorkspace = trpc.workspace.delete.useMutation({
        onSuccess: () => trpcUtils.workspace.getAll.invalidate(),
    });

    const handleSaveProfile = () => {
        updateProfile.mutate({ name, bio });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your profile and workspaces</p>
                    </div>
                    <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        <FaArrowLeft size={12} /> Back to App
                    </Link>
                </div>

                {/* Profile Section */}
                <section className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-foreground text-lg">Profile</h2>

                    <div className="flex items-center gap-4">
                        {profile?.image ? (
                            <img src={profile.image} className="w-16 h-16 rounded-full object-cover border-2 border-border" alt="" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                {profile?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-foreground">{profile?.name}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={updateProfile.isPending}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {updateProfile.isPending ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </section>

                {/* Workspaces Section */}
                <section className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-foreground text-lg">Workspaces</h2>
                    {!workspaces || workspaces.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No workspaces yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {workspaces.map((ws) => (
                                <WorkspaceRow
                                    key={ws.id}
                                    workspace={ws}
                                    onRename={(newName) => renameWorkspace.mutate({ id: ws.id, name: newName })}
                                    onDelete={() => deleteWorkspace.mutate({ id: ws.id })}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Account Section */}
                <section className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h2 className="font-semibold text-foreground text-lg">Account</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-foreground">Email: <span className="text-muted-foreground">{profile?.email}</span></p>
                            <p className="text-sm text-foreground mt-1">Role: <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{profile?.role}</span></p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/landing" })}
                            className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

function WorkspaceRow({ workspace, onRename, onDelete }: {
    workspace: { id: string; name: string };
    onRename: (name: string) => void;
    onDelete: () => void;
}) {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(workspace.name);

    const handleSave = () => {
        if (editName.trim()) {
            onRename(editName.trim());
            setEditing(false);
        }
    };

    return (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors group">
            {editing ? (
                <div className="flex items-center gap-2 flex-1">
                    <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none"
                        autoFocus
                    />
                    <button onClick={handleSave} className="text-primary hover:text-primary/80"><FaCheck size={12} /></button>
                    <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground"><FaTimes size={12} /></button>
                </div>
            ) : (
                <>
                    <span className="text-sm text-foreground">{workspace.name}</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors"><FaPen size={11} /></button>
                        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive transition-colors"><FaTrash size={11} /></button>
                    </div>
                </>
            )}
        </div>
    );
}
