import { ChevronLeft } from "lucide-react";



export default function BookingForm({
  form,
  setForm,
  errors,
  accentColor,
  onConfirm,
  onBack,
}) {

  const setField = (
    key,
    value
  ) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };



  return (

    <div>

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="
          flex
          items-center
          gap-1.5
          text-sm
          text-gray-400
          hover:text-gray-700
          mb-6
          transition-colors
        "
      >

        <ChevronLeft size={15} />

        Back to time slots

      </button>



      {/* HEADER */}
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Your details
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Enter your info to confirm the meeting
      </p>



      {/* FORM */}
      <div className="space-y-4 max-w-sm">

        {/* NAME */}
        <FormField
          label="Full Name *"
          error={errors.name}
        >

          <input
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            value={form.name}
            onChange={(e) =>
              setField(
                "name",
                e.target.value
              )
            }
            className={`
              w-full
              px-3
              py-2.5
              border
              rounded-lg
              text-sm
              transition-colors
              focus:outline-none
              focus:ring-2

              ${
                errors.name
                  ? `
                    border-red-300
                    focus:ring-red-200
                  `
                  : `
                    border-gray-200
                    focus:ring-blue-200
                  `
              }
            `}
          />

        </FormField>



        {/* EMAIL */}
        <FormField
          label="Email Address *"
          error={errors.email}
        >

          <input
            type="email"
            placeholder="jane@company.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) =>
              setField(
                "email",
                e.target.value
              )
            }
            className={`
              w-full
              px-3
              py-2.5
              border
              rounded-lg
              text-sm
              transition-colors
              focus:outline-none
              focus:ring-2

              ${
                errors.email
                  ? `
                    border-red-300
                    focus:ring-red-200
                  `
                  : `
                    border-gray-200
                    focus:ring-blue-200
                  `
              }
            `}
          />

        </FormField>



        {/* SUBMIT */}
        <div className="pt-2">

          <button
            onClick={onConfirm}
            className="
              w-full
              py-3
              rounded-xl
              text-white
              text-sm
              font-semibold
              hover:opacity-90
              transition-opacity
              shadow-md
            "
            style={{
              background: accentColor,
            }}
          >
            Confirm Meeting
          </button>



          <p className="text-xs text-center text-gray-400 mt-3">
            A calendar invite will be sent to your email
          </p>

        </div>

      </div>

    </div>
  );
}



// FORM FIELD
function FormField({
  label,
  error,
  children,
}) {

  return (

    <div>

      <label
        className="
          block
          text-sm
          font-medium
          text-gray-700
          mb-1.5
        "
      >
        {label}
      </label>



      {children}



      {error && (

        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>

      )}

    </div>
  );
}