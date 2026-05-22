import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { useApp } from "../../context/AppContext";
import { backendURL } from "../../App";
import CalendarGrid from "./CalendarGrid";
import BookingForm from "./BookingForm";
import SuccessScreen from "./SuccessScreen";
import {
  formatDateLong,
  formatTime,
} from "../../utils/timeHelpers";



const STAGE = {
  CALENDAR: "calendar",
  FORM: "form",
  SUCCESS: "success",
};



export default function PublicBookingView() {

  const {
    activeEvent: event,
    openAdmin,
  } = useApp();



  const [stage, setStage] =
    useState(STAGE.CALENDAR);

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
    });

  const [errors, setErrors] =
    useState({});



  // EVENT NOT FOUND
  if (!event) {

    return (

      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "#F3F4F6",
        }}
      >

        <div className="text-center">

          <p className="text-gray-400 mb-4">
            Event not found.
          </p>

          <button
            onClick={openAdmin}
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back to Admin
          </button>

        </div>

      </div>
    );
  }



  // SELECT DATE
  const handleDateSelect = (
    dateStr
  ) => {

    setSelectedDate(dateStr);

    setSelectedSlot(null);

    setStage(STAGE.CALENDAR);
  };



  // SELECT SLOT
  const handleSlotSelect = (
    slot
  ) => {

    setSelectedSlot(slot);

    setErrors({});

    setStage(STAGE.FORM);
  };



  // CREATE BOOKING
  const handleConfirm = async () => {

    const errs = {};



    if (!form.name.trim()) {

      errs.name =
        "Name is required";
    }



    if (
      !form.email.trim() ||
      !/\S+@\S+\.\S+/.test(form.email)
    ) {

      errs.email =
        "Valid email required";
    }



    if (
      Object.keys(errs).length
    ) {

      setErrors(errs);

      return;
    }



    try {

      const payload = {

        event_type_id: event.id,

        invitee_name: form.name,

        invitee_email: form.email,

        booking_date: selectedDate,

        start_time: selectedSlot,
      };



      const response =
        await axios.post(
          `${backendURL}/api/v1/booking`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );



      if (
        response.data.success
      ) {

        setStage(
          STAGE.SUCCESS
        );
      }

    } catch (error) {

      console.error(error);
    }
  };



  return (

    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#F3F4F6",
      }}
    >

      {/* TOPBAR */}
      <TopBar
        event={event}
        onBack={openAdmin}
      />



      {/* MAIN CARD */}
      <div className="flex-1 flex items-start justify-center p-4 py-8">

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            w-full
            max-w-4xl
            overflow-hidden
            border
            border-gray-100
          "
        >

          {stage === STAGE.SUCCESS ? (

            <SuccessScreen
              event={event}
              date={selectedDate}
              slot={selectedSlot}
              name={form.name}
              onBack={openAdmin}
            />

          ) : (

            <div className="flex flex-col md:flex-row min-h-[560px]">

              {/* LEFT PANEL */}
              <EventInfoPanel
                event={event}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                showSlot={
                  stage === STAGE.FORM
                }
                onChangeTime={() =>
                  setStage(
                    STAGE.CALENDAR
                  )
                }
              />



              {/* RIGHT PANEL */}
              <div className="flex-1 p-6 md:p-8">

                {stage === STAGE.FORM ? (

                  <BookingForm
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    accentColor={event.color}
                    onConfirm={handleConfirm}
                    onBack={() =>
                      setStage(
                        STAGE.CALENDAR
                      )
                    }
                  />

                ) : (

                  <CalendarGrid
                    event={event}
                    selectedDate={selectedDate}
                    onDateSelect={
                      handleDateSelect
                    }
                    onSlotSelect={
                      handleSlotSelect
                    }
                  />

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}



function TopBar({
  event,
  onBack,
}) {

  return (

    <div
      className="
        bg-white
        border-b
        border-gray-100
        px-4
        py-3
        flex
        items-center
        gap-3
      "
    >

      <button
        onClick={onBack}
        className="
          flex
          items-center
          gap-1.5
          text-sm
          text-gray-500
          hover:text-gray-800
          transition-colors
        "
      >

        <ArrowLeft size={15} />

        Back to Dashboard

      </button>



      <div className="h-4 w-px bg-gray-200" />



      <div className="flex items-center gap-1.5">

        <div
          className="
            w-5
            h-5
            rounded
            flex
            items-center
            justify-center
          "
          style={{
            background: "#006BFF",
          }}
        >

          <Calendar
            size={11}
            className="text-white"
          />

        </div>



        <span
          className="
            text-sm
            text-gray-500
            font-medium
          "
        >
          calendify.app/{event.slug}
        </span>

      </div>

    </div>
  );
}



function EventInfoPanel({
  event,
  selectedDate,
  selectedSlot,
  showSlot,
  onChangeTime,
}) {

  return (

    <div
      className="
        md:w-72
        lg:w-80
        flex-shrink-0
        border-b
        md:border-b-0
        md:border-r
        border-gray-100
        p-6
        md:p-8
      "
    >

      {/* USER */}
      <div className="flex items-center gap-2 mb-1">

        <div
          className="
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-xs
            font-bold
            flex-shrink-0
          "
          style={{
            background: "#006BFF",
          }}
        >
          A
        </div>

        <span className="text-sm text-gray-500">
          Admin User
        </span>

      </div>



      {/* EVENT TITLE */}
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">
        {event.title}
      </h1>



      {/* BADGES */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">

        <span
          className="
            flex
            items-center
            gap-1.5
            text-sm
            px-2.5
            py-1
            rounded-full
            text-white
            font-medium
          "
          style={{
            background: event.color,
          }}
        >

          <Clock size={12} />

          {event.duration} min

        </span>



        <span className="flex items-center gap-1.5 text-sm text-gray-500">

          <Video size={13} />

          Video call

        </span>

      </div>



      <p className="text-sm text-gray-500 leading-relaxed">
        {event.description}
      </p>



      {/* SELECTED SLOT */}
      {selectedDate && (

        <div className="mt-6 pt-6 border-t border-gray-100">

          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Selected Date
          </p>

          <p className="text-sm font-semibold text-gray-800">
            {formatDateLong(selectedDate)}
          </p>



          {selectedSlot &&
            showSlot && (

              <>

                <p className="text-xs text-gray-400 uppercase tracking-wide mt-3 mb-1">
                  Time Slot
                </p>

                <p
                  className="text-sm font-semibold"
                  style={{
                    color: event.color,
                  }}
                >
                  {formatTime(selectedSlot)}
                </p>



                <button
                  onClick={onChangeTime}
                  className="
                  mt-2
                  text-xs
                  text-gray-400
                  hover:text-gray-600
                  flex
                  items-center
                  gap-1
                  transition-colors
                "
                >

                  <ChevronLeft size={12} />

                  Change time

                </button>

              </>

            )}

        </div>

      )}

    </div>
  );
}