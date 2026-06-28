"use client";

import { forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

// Labelled input wired for react-hook-form. Spread `register(name, rules)`
// onto it and pass the field's error object; it renders the message + a11y state.
const FormField = forwardRef(function FormField(
  { label, type = "text", error, hint, ...props },
  ref
) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div>
      <label htmlFor={props.name} className="block text-[13.5px] font-semibold text-ink mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={props.name}
          type={inputType}
          aria-invalid={error ? "true" : "false"}
          className={`w-full rounded-xl border bg-white px-3.5 h-[46px] text-[14.5px] text-ink placeholder:text-body/55 outline-none transition-colors ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              : "border-black/10 focus:border-brand focus:ring-2 focus:ring-brand-soft"
          } ${isPassword ? "pr-11" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-body/60 hover:text-ink"
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium text-rose-500">
          <AlertCircle size={13} /> {error.message}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12.5px] text-body">{hint}</p>
      ) : null}
    </div>
  );
});

export default FormField;
