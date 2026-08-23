"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { PROFILE_TABS, type TabId, type ProfileTab } from "@/data/userProfiles";
import UserProfileBackgroundScrubber from "@/components/UserProfileBackgroundScrubber";
import InfiniteScrollWrapper from "@/components/InfiniteScrollWrapper";
import UserProfileTabsV2 from "./UserProfileTabsV2";
import MetricsBandV2 from "./MetricsBandV2";
import ChairmanSectionV2 from "./ChairmanSectionV2";
import HighlightsStrategySectionV2 from "./HighlightsStrategySectionV2";
import LeadershipSectionV2 from "./LeadershipSectionV2";
import StrategyImageSectionV2 from "./StrategyImageSectionV2";
import KeyFeaturesBannerV2 from "./KeyFeaturesBannerV2";
import AiEnabledDigitalReport from "./AiEnabledDigitalReport";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TAB_LABELS = PROFILE_TABS.map((tab) => ({
  id: tab.id,
  title: tab.title,
  heroTitle: tab.heroTitle,
}));

const HEADING_GRADIENT =
  "font-heading font-medium heading-gradient drop-shadow-2xl";

const SCENE_SECTION =
  "relative w-full flex flex-col items-center justify-center py-8 px-4 md:px-8 z-10 blur-reveal-section will-change-[filter,opacity,transform] scroll-mt-28";

const GLASS_PANEL =
  "w-full max-w-7xl bg-glass-faint border border-border-subtle rounded-3xl p-6 md:p-8 lg:p-10 transition-all duration-500 ease-out hover:bg-glass-card-hover hover:border-border-card-hover hover:shadow-metric-hover";

const ALL_SCENES = [
  { id: "scene-hero", label: "Intro" },
  { id: "scene-metrics", label: "Metrics" },
  { id: "scene-leadership", label: "Leadership" },
  { id: "scene-features", label: "Features" },
  { id: "ai-enabled-report", label: "AI Report" },
  { id: "scene-highlights", label: "Highlights & Strategy" },
  { id: "scene-leadership-governance", label: "Governance" },
  { id: "scene-strategy", label: "Strategy" },
];

function getScenesForTab(tab: ProfileTab) {
  return ALL_SCENES.filter(({ id }) => {
    if (id === "scene-leadership") return !!tab.message;
    if (id === "scene-leadership-governance") return !!tab.governance;
    if (id === "scene-strategy") return !!tab.strategyImage;
    return true;
  });
}

export default function UserProfilePageV2() {
  const [activeTab, setActiveTab] = useState<TabId>("shareholders");
  const [activeScene, setActiveScene] = useState("scene-hero");
  const mainRef = useRef<HTMLDivElement>(null);

  const tab = PROFILE_TABS.find((t) => t.id === activeTab) ?? PROFILE_TABS[0];

  const isGeneralUser = activeTab === "generalUser";

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    const nextTab = PROFILE_TABS.find((t) => t.id === tabId) ?? PROFILE_TABS[0];
    const scenes = getScenesForTab(nextTab);
    if (scenes.length > 0) {
      setActiveScene(scenes[0].id);
    }
  }, []);

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
    const scenes = getScenesForTab(tab);

    scenes.forEach(({ id }) => {
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
  }, [activeTab, tab]);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${e.clientY}px`
      );
    };

    document.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    return () => document.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useEffect(() => {
    const revealSections = gsap.utils.toArray<HTMLElement>(
      ".blur-reveal-section"
    );

    const ctx = gsap.context(() => {
      revealSections.forEach((section) => {
        gsap.set(section, {
          filter: "filter: blur(24px)",
          opacity: 0,
          y: 100,
          scale: 0.9,
          rotationX: 15,
          transformPerspective: 1200,
        });

        gsap.to(section, {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 45%",
            scrub: 1.5,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <main
      ref={mainRef}
      className="relative w-full min-h-screen overflow-x-hidden text-white font-sans selection:bg-brand-main selection:text-white flex"
    >
      <UserProfileBackgroundScrubber />

      {/* CURSOR AURA */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-90 cursor-aura mix-blend-screen"
      />

      {/* LEFT SIDEBAR - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 flex-col items-start justify-center pl-4 z-50 pointer-events-auto">
        <UserProfileTabsV2
          tabs={TAB_LABELS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          vertical
        />
      </aside>

      {/* FIXED HEADER - Mobile */}
      <div className="fixed top-20 md:top-8 z-40 left-0 right-0 flex justify-center pointer-events-none px-4 md:px-0 lg:hidden">
        <div className="pointer-events-auto relative bg-glass-header border border-border-faint backdrop-blur-md rounded-full px-4 md:px-6 py-2 shadow-2xl max-w-full">
          <UserProfileTabsV2
            tabs={TAB_LABELS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* VERTICAL SCENE NAVIGATION */}
      <nav
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-100 flex-col items-center gap-5 pointer-events-auto hidden lg:flex"
        aria-label="Scene navigation"
      >
        {getScenesForTab(tab).map(({ id, label }) => {
          const isActive = activeScene === id;
          return (
            <button
              key={id}
              onClick={() => {
                const el = document.getElementById(id);
                if (!el) return;
                const targetY =
                  el.getBoundingClientRect().top +
                  window.scrollY -
                  window.innerHeight / 2;
                gsap.to(window, {
                  scrollTo: { y: targetY, autoKill: false },
                  duration: 1.2,
                  ease: "power2.inOut",
                });
              }}
              className="group relative flex items-center justify-center"
              aria-label={`Go to ${label}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-3 w-3 bg-white shadow-scene-active scale-125"
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

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full min-w-0 lg:ml-32 xl:ml-40">
        <InfiniteScrollWrapper>
          <div className="flex flex-col w-full original-content-block relative">
            {/* SCENE 1: Hero / Intro */}
            <section
              id="scene-hero"
              className="relative w-full min-h-screen flex flex-col items-center justify-center pt-45 pb-32 px-4 md:px-8 z-10 scroll-mt-28"
              data-scene
            >
              <div className="flex flex-col items-center text-center gap-6 max-w-4xl">
                <h1
                  data-animate
                  className={`${HEADING_GRADIENT} text-5xl md:text-6xl lg:text-8xl`}
                >
                  {tab.heroTitle}
                </h1>
                {tab.intro && (
                  <p
                    data-animate
                    data-parallax
                    className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl drop-shadow-md"
                  >
                    {tab.intro}
                  </p>
                )}
                {/* {tab.intro && (
                  <div
                    data-animate
                    data-parallax
                    className="mt-8 max-w-3xl text-lg text-slate-200 leading-relaxed text-center bg-glass-faint backdrop-blur-2xl border border-border-subtle shadow-glass-panel rounded-3xl p-8 transition-all duration-500 hover:bg-glass-card-hover hover:border-border-card-hover hover:shadow-metric-hover hover:-translate-y-1"
                  >
                    <p className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed">
                      {tab.intro}
                    </p>
                  </div>
                )} */}
                <button
                  onClick={() => {
                    const target = document.getElementById("scene-metrics");
                    if (target) {
                      const y =
                        target.getBoundingClientRect().top + window.scrollY;
                      gsap.to(window, {
                        scrollTo: { y, autoKill: false },
                        duration: 1.5,
                        ease: "power2.inOut",
                      });
                    }
                  }}
                  className="mt-16 flex flex-col items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 group cursor-pointer"
                >
                  <span className="text-xs font-light tracking-[0.2em] uppercase">
                    Scroll Down
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 animate-bounce"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </button>
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
              <section
                id="scene-leadership"
                className={SCENE_SECTION}
                data-scene
              >
                <ChairmanSectionV2
                  title={tab.message.title}
                  text={tab.message.text}
                />
              </section>
            )}

            {/* SCENE 4: Key Features */}
            <section id="scene-features" className={SCENE_SECTION} data-scene>
              <div className={GLASS_PANEL}>
                <KeyFeaturesBannerV2 />
              </div>
            </section>

            {/* SCENE 5: AI-Enabled Digital Report */}
            <section id="ai-enabled-report" className={SCENE_SECTION} data-scene>
              <AiEnabledDigitalReport />
            </section>

            {/* SCENE 6: Highlights & Strategy */}
            <section id="scene-highlights" className={SCENE_SECTION} data-scene>
              <div className={GLASS_PANEL}>
                <HighlightsStrategySectionV2
                  highlights={tab.highlights}
                  strategy={tab.strategy}
                />
              </div>
            </section>

            {/* SCENE 6: Leadership and Governance */}
            {tab.governance && (
              <section
                id="scene-leadership-governance"
                className={SCENE_SECTION}
                data-scene
              >
                <div className={GLASS_PANEL}>
                  <LeadershipSectionV2 governance={tab.governance} />
                </div>
              </section>
            )}

            {/* SCENE 7: Strategy Image */}
            {tab.strategyImage && (
              <section id="scene-strategy" className={SCENE_SECTION} data-scene>
                <div className={GLASS_PANEL}>
                  <StrategyImageSectionV2
                    title={tab.strategyImage.title}
                    image={tab.strategyImage.image}
                    caption={tab.strategyImage.caption}
                    isGeneralUser={isGeneralUser}
                  />
                </div>
              </section>
            )}
          </div>
        </InfiniteScrollWrapper>
      </div>
    </main>
  );
}
