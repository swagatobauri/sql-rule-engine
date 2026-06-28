import { Loader2 } from "lucide-react";

// Primary auth submit button with a built-in pending spinner.
export default function SubmitButton({ children, pending }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold h-[48px] shadow-soft transition-colors"
    >
      {pending && <Loader2 size={17} className="animate-spin" />}
      {children}
    </button>
  );
}
