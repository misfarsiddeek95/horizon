"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROFILE_TABS, type TabId } from "@/data/userProfiles";
import UserProfileBackgroundScrubber from "@/components/UserProfileBackgroundScrubber";
import InfiniteScrollWrapper from "@/components/InfiniteScrollWrapper";
import UserProfileTabsV2 from "./UserProfileTabsV2";
import MetricsBandV2 from "./MetricsBandV2";
import ChairmanSectionV2 from "./ChairmanSectionV2";
import GovernanceStrategySectionV2 from "./GovernanceStrategySectionV2";
import StrategyImageSectionV2 from "./StrategyImageSectionV2";
import KeyFeaturesBannerV2 from "./KeyFeaturesBannerV2";

gsap.registerPlugin(ScrollTrigger);

const TAB_LABELS = PROFILE_TABS.map((tab) => ({
  id: tab.id,
  title: tab.title,
}));

const HEADING_GRADIENT =
  "font-['Minion_Pro'] font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl";

const SCENE_SECTION =
  "relative w-full min-h-screen flex flex-col items-center justify-center py-32 px-4 md:px-8 z-10";

const GLASS_PANEL =
  "w-full max-w-7xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/70 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]";

const SCENES = [
  { id: "scene-hero", label: "Intro" },
  { id: "scene-metrics", label: "Metrics" },
  { id: "scene-leadership", label: "Leadership" },
  { id: "scene-governance", label: "Governance" },
  { id: "scene-strategy", label: "Strategy" },
  { id: "scene-features", label: "Features" },
];

export default function UserProfilePageV2() {
  const [activeTab, setActiveTab] = useState<TabId>("shareholders");
  const [activeScene, setActiveScene] = useState("scene-hero");
  const mainRef = useRef<HTMLDivElement>(null);

  const tab = PROFILE_TABS.find((t) => t.id === activeTab) ?? PROFILE_TABS[0];

  const isGeneralUser = activeTab === "generalUser";

  const animateScene = useCallback((container: Element) => {
    const targets = container.querySelectorAll("[data-animate]");
    if (!targets.length) return;

    gsap.set(targets, { y: 50, opacity: 0 });

    return gsap.to(targets, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  useEffect(() => {
    if (!mainRef.current) return;

    const cards = mainRef.current.querySelectorAll("[data-parallax]");
    const cleanupFns: Array<() => void> = [];

    cards.forEach((card) => {
      const tween = gsap.fromTo(
        card,
        { yPercent: 15 },
        {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
      cleanupFns.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });

    const scenes = mainRef.current.querySelectorAll("[data-scene]");
    scenes.forEach((scene) => {
      const tween = animateScene(scene);
      if (tween) {
        cleanupFns.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      }
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [activeTab, animateScene]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SCENES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveScene(id);
            }
          });
        },
        { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [activeTab]);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${e.clientY}px`);
    };

    document.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => document.removeEventListener("mousemove", handlePointerMove);
  }, []);

  return (
    <main
      ref={mainRef}
      className="relative w-full min-h-screen text-white font-sans selection:bg-brand-main selection:text-white"
    >
      <UserProfileBackgroundScrubber />

      {/* CURSOR AURA */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] cursor-aura mix-blend-screen"
      />

      {/* FIXED HEADER */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto relative bg-[rgba(1,34,46,0.76)] border border-[rgba(199,237,246,0.24)] backdrop-blur-md rounded-full px-4 md:px-6 py-2 shadow-2xl">
          <UserProfileTabsV2
            tabs={TAB_LABELS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* VERTICAL SCENE NAVIGATION */}
      <nav
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex-col items-center gap-5 pointer-events-auto hidden lg:flex"
        aria-label="Scene navigation"
      >
        {SCENES.map(({ id, label }) => {
          const isActive = activeScene === id;
          return (
            <button
              key={id}
              onClick={() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative flex items-center justify-center"
              aria-label={`Go to ${label}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-3 w-3 bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)] scale-125"
                    : "h-2 w-2 bg-white/30 group-hover:bg-white/60 group-hover:scale-125"
                }`}
              />
              <span className="absolute right-8 whitespace-nowrap rounded-lg bg-slate-900/80 backdrop-blur-xl px-3 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* INFINITE SCROLL CONTENT */}
      <div className="relative z-10 w-full">
        <InfiniteScrollWrapper>
          <div className="flex flex-col w-full original-content-block relative">

            {/* SCENE 1: Hero / Intro */}
            <section id="scene-hero" className={SCENE_SECTION} data-scene>
              <div className="flex flex-col items-center text-center gap-6 max-w-4xl">
                <h1
                  data-animate
                  className={`${HEADING_GRADIENT} text-5xl md:text-6xl lg:text-8xl`}
                >
                  User Profiles
                </h1>
                <p
                  data-animate
                  className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl drop-shadow-md"
                >
                  Explore Haycarb through the lens that matters to you —
                  performance, strategy, and sustainable value creation.
                </p>
                {tab.intro && (
                  <div
                    data-animate
                    data-parallax
                    className="max-w-3xl bg-slate-900/50 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/10 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                  >
                    <p className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed">
                      {tab.intro}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* SCENE 2: Key Metrics */}
            <section id="scene-metrics" className={SCENE_SECTION} data-scene>
              <MetricsBandV2
                key={activeTab}
                groups={tab.metricGroups}
                tabTitle={tab.title}
                tabIntro={tab.intro}
              />
            </section>

            {/* SCENE 3: Chairman / MD Message */}
            {tab.message && (
              <section id="scene-leadership" className={SCENE_SECTION} data-scene>
                <div data-parallax className={GLASS_PANEL}>
                  <ChairmanSectionV2
                    title={tab.message.title}
                    text={tab.message.text}
                  />
                </div>
              </section>
            )}

            {/* SCENE 4: Governance & Strategy */}
            <section id="scene-governance" className={SCENE_SECTION} data-scene>
              <div data-parallax className={GLASS_PANEL}>
                <GovernanceStrategySectionV2
                  governance={tab.governance}
                  highlights={tab.highlights}
                  strategy={tab.strategy}
                />
              </div>
            </section>

            {/* SCENE 5: Strategy Image */}
            {tab.strategyImage && (
              <section id="scene-strategy" className={SCENE_SECTION} data-scene>
                <div data-parallax className={GLASS_PANEL}>
                  <StrategyImageSectionV2
                    title={tab.strategyImage.title}
                    image={tab.strategyImage.image}
                    caption={tab.strategyImage.caption}
                    isGeneralUser={isGeneralUser}
                  />
                </div>
              </section>
            )}

            {/* SCENE 6: Key Features */}
            <section id="scene-features" className={SCENE_SECTION} data-scene>
              <div data-parallax className={GLASS_PANEL}>
                <KeyFeaturesBannerV2 />
              </div>
            </section>

          </div>
        </InfiniteScrollWrapper>
      </div>
    </main>
  );
}
