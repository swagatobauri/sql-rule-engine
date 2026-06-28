"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, Flame, LogOut, Menu, Settings, User, X } from "lucide-react";
import { Logo } from "./Illustrations";

const NAV_ITEMS = [
  { label: "Dashboard" },
  { label: "Guesstimates" },
  { label: "SQL Practice", active: true },
  { label: "Courses" },
  { label: "Resources", hasCaret: true },
  { label: "Track Progress" },
];

const NOTIFICATIONS = [
  { title: "Your SQL mock was evaluated", time: "2h ago" },
  { title: "New Window Functions set added", time: "1d ago" },
  { title: "You're on a 12-day streak 🔥", time: "1d ago" },
];

function NavItem({ label, active, hasCaret, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1 text-[14.5px] font-medium pb-1 ${
        active ? "text-carrot" : "text-ink/70 hover:text-ink"
      }`}
    >
      {label}
      {hasCaret && <ChevronDown size={15} strokeWidth={2} />}
      {active && (
        <span className="absolute -bottom-[19px] left-0 right-0 h-[2.5px] rounded-full bg-carrot" />
      )}
    </button>
  );
}

function useOutsideClose(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);
  return ref;
}

export default function Navbar() {
  const [current, setCurrent] = useState("SQL Practice");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const bellRef = useOutsideClose(bellOpen, () => setBellOpen(false));
  const profileRef = useOutsideClose(profileOpen, () => setProfileOpen(false));

  return (
    <header className="bg-white/70 backdrop-blur border-b border-black/[0.06] sticky top-0 z-40">
      <div className="px-6 min-h-[60px] flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={current === item.label}
              onClick={() => setCurrent(item.label)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 px-2.5 py-1 text-[13px] font-bold text-carrot">
            <Flame size={15} fill="currentColor" strokeWidth={0} /> 12
          </span>

          {/* Notifications */}
          <div className="relative" ref={bellRef}>
            <button
              aria-label="Notifications"
              onClick={() => {
                setBellOpen((o) => !o);
                setProfileOpen(false);
              }}
              className="relative grid place-items-center w-9 h-9 rounded-full text-ink/55 hover:bg-black/5"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-carrot ring-2 ring-white" />
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-[280px] rounded-xl bg-white border border-black/10 shadow-soft p-2 z-50">
                <p className="px-2 py-1.5 text-[13px] font-bold text-ink">Notifications</p>
                <div className="divide-y divide-black/[0.05]">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.title} className="flex items-start gap-2.5 px-2 py-2.5">
                      <span className="mt-0.5 grid place-items-center w-7 h-7 rounded-lg bg-brand-soft text-brand shrink-0">
                        <Bell size={13} />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-semibold text-ink leading-snug">{n.title}</p>
                        <p className="text-[11px] text-body">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen((o) => !o);
                setBellOpen(false);
              }}
              className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full hover:bg-black/5"
            >
              <span className="grid place-items-center w-7 h-7 rounded-full bg-brand text-white text-[12px] font-bold">
                A
              </span>
              <span className="hidden sm:block text-[14px] font-semibold">Amit</span>
              <ChevronDown
                size={15}
                strokeWidth={2}
                className={`text-ink/50 transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-[200px] rounded-xl bg-white border border-black/10 shadow-soft p-1.5 z-50">
                <div className="px-2.5 py-2 border-b border-black/[0.06] mb-1">
                  <p className="text-[13px] font-bold text-ink">Amit Sharma</p>
                  <p className="text-[11.5px] text-body">amit@careercafe.io</p>
                </div>
                {[
                  { label: "My Profile", Icon: User },
                  { label: "Settings", Icon: Settings },
                ].map(({ label, Icon }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-[13px] text-ink/80 hover:bg-black/[0.03]">
                    <Icon size={15} className="text-ink/55" /> {label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-2.5 rounded-lg px-2.5 h-9 text-[13px] text-rose-500 hover:bg-rose-50">
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden grid place-items-center w-9 h-9 rounded-full text-ink/70 hover:bg-black/5"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-black/[0.06] bg-white px-6 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setCurrent(item.label);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between rounded-lg px-3 h-11 text-[14.5px] font-medium ${
                current === item.label ? "bg-orange-50 text-carrot" : "text-ink/75 hover:bg-black/[0.03]"
              }`}
            >
              {item.label}
              {current === item.label && <Check size={16} />}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
