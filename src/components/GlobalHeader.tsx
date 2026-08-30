"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Charts & Reports Generator", path: "/tailor-made-for-you" },
  { name: "Crossword Puzzle", path: "/puzzle" },
  { name: "AI Chat Assistant", path: "/chat" },
  { name: "User Profiles", path: "/user-profile" },
  { name: "Dashboard", path: "/dashboard" },
];

const darkPages = ['/chat', '/user-profile'];
const whiteBarPages = ['/dashboard', '/tailor-made-for-you', '/puzzle'];
const fixedPages = ['/user-profile'];

export default function GlobalHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLightBg = !darkPages.some((p) => pathname.startsWith(p));
  const useWhiteBars = whiteBarPages.some((p) => pathname === p);
  const useFixed = fixedPages.some((p) => pathname.startsWith(p));
  const barColor = useWhiteBars ? 'bg-white' : isLightBg ? 'bg-[#147385]' : 'bg-white';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${useFixed ? 'fixed' : 'absolute'} top-0 left-0 z-[9999] bg-transparent p-4 transition-colors duration-300`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="flex flex-col justify-center items-center w-7 h-7 gap-1.5">
          <span
            className={`block w-7 h-0.5 ${isOpen ? 'bg-white' : barColor} rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 ${isOpen ? 'bg-white' : barColor} rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 ${isOpen ? 'bg-white' : barColor} rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </span>
      </button>

      <nav
        className={`fixed inset-0 z-[9998] bg-glass-strong backdrop-blur-3xl transition-transform duration-700 ease-in-out ${
          isOpen
            ? "translate-y-0 md:translate-y-0 translate-x-0"
            : "-translate-y-full md:-translate-y-full -translate-x-full"
        } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* HEADER: Logo + Video Thumbnail */}
        <div className="absolute top-0 left-0 w-full flex items-start justify-end px-4 py-4 md:px-8 md:py-8 z-50">
          {/* Logo (Center) */}
          <img
            src="/images/logo.png"
            alt="HeyCarb"
            className="absolute left-1/2 -translate-x-1/2 top-4 md:top-8 h-12 md:h-16 lg:h-20 w-auto object-contain"
          />

          {/* Video Thumbnail (Right) */}
          <button
            type="button"
            className="relative overflow-hidden w-28 h-16 sm:w-36 sm:h-20 md:w-48 md:h-28 rounded-lg bg-black/20 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all cursor-pointer group shadow-lg"
            aria-label="Play video"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </button>
        </div>

        <div className="flex flex-col justify-center h-full pl-12 sm:pl-20">
          {menuLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={handleLinkClick}
              className="group py-3 font-sans text-white text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight hover:text-[var(--color-heading-start)] transition-colors duration-300"
            >
              {link.name}
              {pathname === link.path && (
                <span className="ml-4 inline-block">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-[var(--color-heading-start)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
