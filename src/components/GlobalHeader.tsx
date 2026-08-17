"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Charts & Reports Generator", path: "/tailor-made-for-you" },
  { name: "FinQuest Game", path: "/puzzle" },
  { name: "User Profiles", path: "/user-profile-v2" },
];

export default function GlobalHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
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
        className="fixed top-6 left-6 z-[100] bg-transparent hover:bg-white/10 rounded-full p-3 transition-colors duration-300"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="flex flex-col justify-center items-center w-7 h-7 gap-1.5">
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white rounded-full transition-all duration-500 ease-in-out ${
              isOpen ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </span>
      </button>

      <nav
        className={`fixed inset-0 z-50 bg-glass-strong backdrop-blur-3xl transition-transform duration-700 ease-in-out ${
          isOpen
            ? "translate-y-0 md:translate-y-0 translate-x-0"
            : "-translate-y-full md:-translate-y-full -translate-x-full"
        } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="flex flex-col justify-center h-full pl-12 sm:pl-20">
          {menuLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={handleLinkClick}
              className="group py-3 font-sans text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight hover:text-brand-main transition-colors duration-300"
            >
              {link.name}
              {pathname === link.path && (
                <span className="ml-4 inline-block">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-brand-main"
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
