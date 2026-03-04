
import { AppBar } from "./components/AppBar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <main className="flex min-h-screen w-full flex-col lg:p-16 p-4">
        <AppBar />
      </main>
    </div>
  );
}
