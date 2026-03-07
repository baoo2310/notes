import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppBar } from "./components/AppBar";
import MainContent from "./components/MainContent";
import { SidebarProvider } from "./context/SidebarContext";
import { PageProvider } from "./context/PageContext";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/landing");

  return (
    <SidebarProvider>
      <PageProvider>
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans transition-colors duration-300">
          <main className="flex h-full w-full flex-col p-4">
            <AppBar />
            <MainContent />
          </main>
        </div>
      </PageProvider>
    </SidebarProvider>
  );
}
