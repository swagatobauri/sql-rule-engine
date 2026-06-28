import { Play } from "lucide-react";

// Hand-built brand mark + decorative scene illustrations.
// Kept as SVG so they scale crisply and need no image assets.

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-carrot text-white shadow-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l8.66 5v10L12 22 3.34 17V7z" />
          <path d="M15 9.5a4 4 0 1 0 0 5" />
        </svg>
      </span>
      <span className="text-[19px] font-extrabold tracking-tight text-ink">CareerCafe</span>
    </div>
  );
}

export function HeroIllustration() {
  return (
    <div className="relative w-full h-full grid place-items-center">
      <span className="absolute left-[6%] top-[58%] text-brand/30 text-2xl">+</span>
      <span className="absolute left-[2%] top-[40%] text-brand/25 text-xl">+</span>
      <span className="absolute right-[10%] top-[10%] text-brand/30 text-2xl">+</span>
      <span className="absolute right-[2%] top-[42%] text-brand/25 text-2xl">+</span>
      <svg
        className="absolute left-1/2 top-2 -translate-x-1/2"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8E76E8"
        strokeWidth="1.6"
      >
        <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </svg>

      {/* editor window */}
      <div className="relative w-[330px] rounded-2xl bg-[#23284A] shadow-soft overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 h-9 bg-[#1B2040]">
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
        </div>
        <div className="bg-white p-5">
          <div className="text-brand font-bold text-[14px] mb-3">SELECT</div>
          <div className="space-y-2.5">
            {[80, 62, 72, 55].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="h-2 rounded bg-slate-200" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="h-3.5 rounded bg-violet-100" />
            ))}
          </div>
        </div>
        <button className="absolute right-4 bottom-4 grid place-items-center w-10 h-10 rounded-xl bg-brand text-white shadow-lg">
          <Play size={18} fill="currentColor" strokeWidth={0} />
        </button>
      </div>

      {/* database cylinder */}
      <div className="absolute -bottom-2 right-[16%]">
        <svg width="70" height="78" viewBox="0 0 70 78" fill="none">
          <ellipse cx="35" cy="60" rx="30" ry="11" fill="#B7A6F0" />
          <rect x="5" y="22" width="60" height="38" fill="#C9BBF5" />
          <ellipse cx="35" cy="22" rx="30" ry="11" fill="#9F89EC" />
          <ellipse cx="35" cy="38" rx="30" ry="11" fill="#B7A6F0" />
        </svg>
      </div>
    </div>
  );
}

export function LiveInterviewIllustration() {
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
      <ellipse cx="60" cy="98" rx="52" ry="8" fill="#000" opacity="0.05" />
      {/* code bubble */}
      <rect x="2" y="6" width="40" height="30" rx="8" fill="#fff" stroke="#E6E1F5" />
      <path d="M16 36l4 7 5-7z" fill="#fff" stroke="#E6E1F5" />
      <path
        d="M14 16l-5 5 5 5M30 16l5 5-5 5M25 14l-6 14"
        stroke="#7C5CF0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* person */}
      <circle cx="74" cy="40" r="13" fill="#2C2235" />
      <circle cx="70" cy="42" r="9" fill="#F1B98E" />
      <rect x="62" y="38" width="16" height="5" rx="2.5" fill="none" stroke="#2C2235" strokeWidth="1.6" />
      <path d="M48 92c0-18 11-32 26-32s26 14 26 30v2H48z" fill="#F26A1B" />
      <path d="M70 62c-8 6-12 18-12 30h8c0-12 2-22 6-26z" fill="#D95A14" />
      {/* laptop */}
      <rect x="40" y="84" width="64" height="9" rx="2" fill="#3A3550" />
      <rect x="50" y="64" width="44" height="24" rx="2" fill="#4A4566" />
      <rect x="54" y="68" width="36" height="16" rx="1" fill="#D9D3EC" />
    </svg>
  );
}
