"use client";
import { useEffect, useRef } from "react";

const FRAME_COUNT = 240;

export default function UserProfileBackgroundScrubber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/user_profile_frames/frame_${i
        .toString()
        .padStart(4, "0")}.jpg`;
      images.push(img);
    }

    const CROSSFADE_FRAMES = 30;
    const LOOP_LENGTH = FRAME_COUNT - CROSSFADE_FRAMES;
    const VIDEO_LOOPS_PER_PAGE = 2;

    let animationFrameId: number;

    const renderLoop = () => {
      const contentBlock = document.querySelector(".original-content-block");
      if (!contentBlock) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      const contentHeight = contentBlock.getBoundingClientRect().height;
      const currentScrollY = window.scrollY;
      const scrollProgress =
        contentHeight > 0 ? currentScrollY / contentHeight : 0;

      const totalFramesScrolled =
        scrollProgress * VIDEO_LOOPS_PER_PAGE * LOOP_LENGTH;

      let t = Math.floor(totalFramesScrolled) % LOOP_LENGTH;
      if (t < 0 || Number.isNaN(t)) t = 0;

      const baseImg = images[0];
      if (!baseImg) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      const hRatio = canvas.width / baseImg.width;
      const vRatio = canvas.height / baseImg.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - baseImg.width * ratio) / 2;
      const centerShift_y = (canvas.height - baseImg.height * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (t < CROSSFADE_FRAMES) {
        const alphaA = t / CROSSFADE_FRAMES;
        const alphaB = 1.0 - alphaA;

        const imgA = images[t];
        const imgB = images[t + LOOP_LENGTH];

        if (imgB) {
          context.globalAlpha = alphaB;
          context.drawImage(
            imgB,
            0,
            0,
            imgB.width,
            imgB.height,
            centerShift_x,
            centerShift_y,
            imgB.width * ratio,
            imgB.height * ratio
          );
        }

        if (imgA) {
          context.globalAlpha = alphaA;
          context.drawImage(
            imgA,
            0,
            0,
            imgA.width,
            imgA.height,
            centerShift_x,
            centerShift_y,
            imgA.width * ratio,
            imgA.height * ratio
          );
        }

        context.globalAlpha = 1.0;
      } else {
        const img = images[t];
        if (img) {
          context.globalAlpha = 1.0;
          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
          );
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    images[0].onload = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 bg-black pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5))",
        }}
      />
    </div>
  );
}
