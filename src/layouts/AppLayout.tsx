import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="lg:pl-60">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
