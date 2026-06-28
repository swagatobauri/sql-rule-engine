import Link from "next/link";
import { Logo } from "@/components/Illustrations";
import { Check } from "lucide-react";

const HIGHLIGHTS = [
  "Timed mocks that mirror real interview pressure",
  "Realistic datasets, not toy tables",
  "Rule-engine feedback on more than the final output",
];

// Two-pane auth layout: brand story on the left, form card on the right.
// Shared by the login and signup pages so branding stays consistent.
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand p-12 text-white">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/[0.07] blur-2xl" />

        <div className="relative [&_span]:text-white">
          <Logo />
        </div>

        <div className="relative">
          <h2 className="text-[34px] leading-[1.12] font-extrabold tracking-[-0.02em] max-w-[420px]">
            Practice SQL the way interviews actually test it.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-white/90">
                <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-full bg-white/20 shrink-0">
                  <Check size={13} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[13px] text-white/60">
          © {2026} CareerCafe. Built for serious interview prep.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Logo shown only on small screens where the brand panel is hidden */}
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <h1 className="text-[27px] font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
          <p className="mt-1.5 text-[14.5px] text-body">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-7 text-center text-[14px] text-body">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({ prompt, href, label }) {
  return (
    <span>
      {prompt}{" "}
      <Link href={href} className="font-semibold text-brand hover:text-brand-dark">
        {label}
      </Link>
    </span>
  );
}
