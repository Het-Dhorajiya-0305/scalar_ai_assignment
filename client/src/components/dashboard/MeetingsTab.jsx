import {
  useEffect,
  useState,
} from "react";

import {
  Calendar,
  Clock,
  X,
} from "lucide-react";

import axios from "axios";

import { backendURL } from "../../App";

import {
  formatDateShort,
  formatTime,
} from "../../utils/timeHelpers";



export default function MeetingsTab() {

  const [upcoming, setUpcoming] =
    useState([]);

  const [past, setPast] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [subTab, setSubTab] =
    useState("upcoming");

  const [availableSlots, setAvailableSlots] =
    useState([]);



  const [cancelConfirm, setCancelConfirm] =
    useState(null);



  const [rescheduleData, setRescheduleData] =
    useState(null);

  const [newDate, setNewDate] =
    useState(new Date());

  const [newTime, setNewTime] =
    useState("");


  const getAvailableSlots = async (
    slug,
    date
  ) => {

    try {

      const response =
        await axios.get(
          `${backendURL}/api/v1/booking/slots/${slug}?date=${date}`
        );



      if (
        response.data.success
      ) {

        setAvailableSlots(
          response.data.data
        );
      }

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    if (
      rescheduleData &&
      newDate
    ) {

      getAvailableSlots(
        rescheduleData.event_slug,
        newDate
      );
    }

  }, [newDate]);

  // GET UPCOMING
  const getUpcomingMeetings = async () => {

    try {

      const response =
        await axios.get(
          `${backendURL}/api/v1/meeting/upcoming`
        );



      if (
        response.data.success
      ) {

        setUpcoming(
          response.data.data
        );
      }

    } catch (error) {

      console.error(error);
    }
  };



  // GET PAST
  const getPastMeetings = async () => {

    try {

      const response =
        await axios.get(
          `${backendURL}/api/v1/meeting/past`
        );



      if (
        response.data.success
      ) {

        setPast(
          response.data.data
        );
      }

    } catch (error) {

      console.error(error);
    }
  };



  // LOAD ALL
  const loadMeetings = async () => {

    try {

      setLoading(true);

      await Promise.all([
        getUpcomingMeetings(),
        getPastMeetings(),
      ]);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };



  // INITIAL LOAD
  useEffect(() => {

    loadMeetings();

  }, []);




  // CANCEL
  const handleConfirmCancel = async () => {

    try {

      const response =
        await axios.patch(
          `${backendURL}/api/v1/booking/${cancelConfirm}/cancel`
        );



      if (
        response.data.success
      ) {

        await loadMeetings();

        setCancelConfirm(null);
      }

    } catch (error) {

      console.error(error);
    }
  };



  // RESCHEDULE
  const handleConfirmReschedule = async () => {

    try {

      const response = await axios.patch(
        `${backendURL}/api/v1/meeting/${rescheduleData.id}/reschedule`,
        {
          booking_date: newDate,
          start_time: newTime,
        }
      );

      if (
        response.data.success
      ) {

        await loadMeetings();

        setRescheduleData(null);

        setNewDate("");

        setNewTime("");
      }

    } catch (error) {

      console.error(error);
    }
  };

  const rows = subTab === "upcoming" ? upcoming : past;


  return (

    <div>

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-2xl font-bold text-gray-900">
          Scheduled Meetings
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          All your booked sessions
        </p>

      </div>



      {/* CARD */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* TABS */}
        <div className="flex border-b border-gray-100">

          {[
            {
              id: "upcoming",
              label: `Upcoming (${upcoming.length})`,
            },
            {
              id: "past",
              label: `Past (${past.length})`,
            },
          ].map(({ id, label }) => (

            <button
              key={id}
              onClick={() =>
                setSubTab(id)
              }
              className={`flex-1 px-6 py-3.5 text-sm font-medium transition-colors ${subTab === id
                ? "border-b-2"
                : "text-gray-500 hover:text-gray-700"
                }`}
              style={
                subTab === id
                  ? {
                    borderBottomColor:
                      "#006BFF",

                    color:
                      "#006BFF",
                  }
                  : {}
              }
            >
              {label}
            </button>

          ))}

        </div>



        {/* CONTENT */}
        {loading ? (

          <div className="py-16 text-center text-gray-400 text-sm">
            Loading meetings...
          </div>

        ) : rows.length === 0 ? (

          <EmptyState
            subTab={subTab}
          />

        ) : (

          <div className="divide-y divide-gray-50">

            {rows.map((booking) => (

              <MeetingRow
                key={booking.id}
                booking={booking}
                isUpcoming={
                  subTab === "upcoming"
                }
                onCancel={() =>
                  setCancelConfirm(
                    booking.id
                  )
                }
                onReschedule={() => {

                  setRescheduleData(
                    booking
                  );

                  setNewDate(
                    booking.booking_date
                  );

                  setNewTime(
                    booking.start_time
                  );
                }}
              />

            ))}

          </div>

        )}

      </div>



      {/* CANCEL MODAL */}
      {cancelConfirm && (

        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() =>
            setCancelConfirm(null)
          }
        >

          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="font-semibold text-gray-900 mb-2">
              Cancel Meeting?
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              The invitee will be notified.
            </p>



            <div className="flex gap-3">

              <button
                onClick={() =>
                  setCancelConfirm(null)
                }
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              >
                Keep
              </button>



              <button
                onClick={
                  handleConfirmCancel
                }
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Meeting
              </button>

            </div>

          </div>

        </div>

      )}



      {/* RESCHEDULE MODAL */}
      {rescheduleData && (

        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() =>
            setRescheduleData(null)
          }
        >

          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="font-semibold text-gray-900 mb-4">
              Reschedule Meeting
            </h3>



            <div className="space-y-4">

              <input
                type="date"
                value={newDate}
                onChange={(e) =>
                  setNewDate(
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />



              <div className="space-y-2 max-h-48 overflow-y-auto">

                {availableSlots.length === 0 ? (

                  <p className="text-sm text-gray-400">
                    No slots available
                  </p>

                ) : (

                  availableSlots.map((slot) => (

                    <button
                      key={slot}
                      onClick={() =>
                        setNewTime(slot)
                      }
                      className={`w-full py-2 rounded-lg border text-sm transition-colors ${newTime === slot
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 hover:border-blue-300"
                        }`}
                    >
                      {formatTime(slot)}
                    </button>

                  ))

                )}

              </div>

            </div>



            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setRescheduleData(null)
                }
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
              >
                Close
              </button>



              <button
                onClick={
                  handleConfirmReschedule
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}



function MeetingRow({
  booking,
  isUpcoming,
  onCancel,
  onReschedule,
}) {

  return (

    <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">

      {/* DOT */}
      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-blue-600" />



      {/* INFO */}
      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2 flex-wrap">

          <span className="font-medium text-gray-900 text-sm">
            {booking.invitee_name}
          </span>



          <span className="text-xs px-2 py-0.5 rounded-full text-white bg-blue-600">
            {booking.event_title}
          </span>

        </div>



        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">

          <span className="flex items-center gap-1">

            <Calendar size={11} />

            {formatDateShort(
              booking.booking_date
            )}

          </span>



          <span className="flex items-center gap-1">

            <Clock size={11} />

            {formatTime(
              booking.start_time
            )}

          </span>



          <span>
            {booking.invitee_email}
          </span>

        </div>

      </div>



      {/* ACTIONS */}
      {isUpcoming ? (

        <div className="flex items-center gap-2 flex-shrink-0">

          <button
            onClick={onReschedule}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            Reschedule
          </button>



          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
          >

            <X size={12} />

            Cancel

          </button>

        </div>

      ) : (

        <span className="text-xs text-gray-300 px-2 py-1 bg-gray-50 rounded-md flex-shrink-0">
          Completed
        </span>

      )}

    </div>
  );
}



function EmptyState({
  subTab,
}) {

  return (

    <div className="py-16 text-center">

      <Calendar
        size={36}
        className="text-gray-200 mx-auto mb-3"
      />

      <p className="text-sm text-gray-400">
        No {subTab} meetings
      </p>

    </div>
  );
}