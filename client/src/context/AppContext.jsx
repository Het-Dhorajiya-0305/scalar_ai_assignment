import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);



export function AppProvider({ children }) {

  // GLOBAL STATE

  const [eventTypes, setEventTypes] = useState([]);

  const [availability, setAvailability] = useState({});

  const [bookings, setBookings] = useState([]);

  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [view, setView] = useState("admin");

  const [bookingSlug, setBookingSlug] = useState(null);



  // ACTIVE EVENT
  const activeEvent = eventTypes.find((e) => e.slug === bookingSlug) ?? null;

  // NAVIGATION
  const openBooking = (slug) => {
    setBookingSlug(slug);
    setView("booking");
  };



  const openAdmin = () => {
    setView("admin");
    setBookingSlug(null);
  };


  const value = {
    eventTypes,
    availability,
    bookings,
    timezone,
    view,
    bookingSlug,
    activeEvent,

    setEventTypes,
    setAvailability,
    setBookings,
    setTimezone,

    openBooking,
    openAdmin,
  };



  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


export function useApp() {

  const ctx = useContext(AppContext);

  if (!ctx) {

    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return ctx;
}