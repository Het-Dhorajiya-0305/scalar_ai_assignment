import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar            from "./components/layout/Sidebar";
import EventTypesTab      from "./components/dashboard/EventTypesTab";
import AvailabilityTab    from "./components/dashboard/AvailabilityTab";
import MeetingsTab        from "./components/dashboard/MeetingsTab";
import PublicBookingView  from "./components/booking/PublicBookingView";

// ─────────────────────────────────────────────
// ROOT — wraps tree in AppProvider
// ─────────────────────────────────────────────

export const backendURL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

// ─────────────────────────────────────────────
// SHELL — reads view from context, renders correct screen
// ─────────────────────────────────────────────

function AppShell() {
  const { view } = useApp();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F3F4F6", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      {view === "admin" ? <AdminDashboard /> : <PublicBookingView />}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD — sidebar + tab content
// ─────────────────────────────────────────────

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {activeTab === "events"       && <EventTypesTab />}
          {activeTab === "availability" && <AvailabilityTab />}
          {activeTab === "meetings"     && <MeetingsTab />}
        </div>
      </main>
    </div>
  );
}
  