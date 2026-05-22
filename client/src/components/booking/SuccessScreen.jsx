import {
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Video,
  ArrowLeft,
} from "lucide-react";

import {
  formatDateFull,
  formatTime,
} from "../../utils/timeHelpers";



export default function SuccessScreen({
  event,
  date,
  slot,
  name,
  onBack,
}) {

  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-16
        px-8
        text-center
      "
    >

      {/* SUCCESS ICON */}
      <div
        className="
          w-16
          h-16
          rounded-full
          flex
          items-center
          justify-center
          mb-5
          shadow-lg
        "
        style={{
          background: "#00A878",
        }}
      >

        <CheckCircle
          size={32}
          className="text-white"
        />

      </div>



      {/* TITLE */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're scheduled!
      </h2>



      {/* SUBTITLE */}
      <p className="text-gray-500 mb-8">
        A calendar invitation has been sent to your email.
      </p>



      {/* RECEIPT */}
      <div
        className="
          bg-gray-50
          rounded-2xl
          p-6
          max-w-sm
          w-full
          text-left
          space-y-4
          mb-8
          border
          border-gray-100
        "
      >

        {/* EVENT */}
        <ReceiptRow
          icon={
            <Calendar
              size={16}
              className="
                text-gray-400
                mt-0.5
                flex-shrink-0
              "
            />
          }
          label="Event"
        >
          {event.title}
        </ReceiptRow>



        {/* DATE */}
        <ReceiptRow
          icon={
            <Clock
              size={16}
              className="
                text-gray-400
                mt-0.5
                flex-shrink-0
              "
            />
          }
          label="When"
        >

          {formatDateFull(date)} at{" "}
          {formatTime(slot)}

        </ReceiptRow>



        {/* USER */}
        <ReceiptRow
          icon={
            <Users
              size={16}
              className="
                text-gray-400
                mt-0.5
                flex-shrink-0
              "
            />
          }
          label="Invitee"
        >
          {name}
        </ReceiptRow>



        {/* LOCATION */}
        <ReceiptRow
          icon={
            <Video
              size={16}
              className="
                text-gray-400
                mt-0.5
                flex-shrink-0
              "
            />
          }
          label="Location"
        >
          Video call link sent via email
        </ReceiptRow>

      </div>



      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-500
          hover:text-gray-800
          transition-colors
        "
      >

        <ArrowLeft size={14} />

        Return to dashboard

      </button>

    </div>
  );
}



// RECEIPT ROW
function ReceiptRow({
  icon,
  label,
  children,
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      {icon}



      <div>

        <p
          className="
            text-xs
            text-gray-400
            uppercase
            tracking-wide
            mb-0.5
          "
        >
          {label}
        </p>



        <p
          className="
            text-sm
            font-semibold
            text-gray-800
          "
        >
          {children}
        </p>

      </div>

    </div>
  );
}