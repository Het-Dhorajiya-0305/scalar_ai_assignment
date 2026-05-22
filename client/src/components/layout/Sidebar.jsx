import { useState } from "react";
import { Calendar, Clock, Users, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "events", label: "Event Types", icon: Calendar },
  { id: "availability", label: "Availability", icon: Clock },
  { id: "meetings", label: "Scheduled Meetings", icon: Users },
];

export default function Sidebar({ activeTab, onTabChange }) {

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  return (
    <>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm">

        <Brand />

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={activeTab === item.id}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </nav>

        <UserFooter />

      </aside>



      {/* MOBILE TOPBAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">

        <Brand compact />

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

      </header>



      {/* MOBILE SIDEBAR */}
      {mobileOpen && (

        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >

          <div
            className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 px-3 py-3 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >

            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeTab === item.id}
                onClick={() => handleNav(item.id)}
              />
            ))}

          </div>

        </div>

      )}

    </>
  );
}



function Brand({ compact = false }) {

  return (

    <div className={`flex items-center gap-2 px-6 border-b border-gray-200 ${compact ? "py-3" : "py-5"}`}>

      <div className={`flex items-center justify-center rounded-lg bg-blue-600 text-white ${compact ? "w-7 h-7" : "w-8 h-8"}`}>

        <Calendar size={compact ? 14 : 16} />

      </div>

      <span className="text-lg font-semibold tracking-tight text-gray-900">
        Calendify
      </span>

    </div>
  );
}



function NavButton({ item, active, onClick }) {

  const { icon: Icon, label } = item;

  return (

    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >

      <Icon size={16} />

      <span>{label}</span>

    </button>
  );
}



function UserFooter() {

  return (

    <div className="px-4 py-4 border-t border-gray-200">

      <div className="flex items-center gap-3">

        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
          A
        </div>

        <div className="min-w-0">

          <p className="text-sm font-medium text-gray-900 truncate">
            Admin User
          </p>

          <p className="text-xs text-gray-500 truncate">
            admin@calendify.com
          </p>

        </div>

      </div>

    </div>
  );
}