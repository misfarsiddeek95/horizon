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
      img.src = `/user_profile_frames/frame_${i.toString().padStart(4, "0")}.jpg`;
      images.push(img);
    }

    const VIDEO_LOOPS_PER_PAGE = 2;

    let animationFrameId: number;
    let lastFrameIndex = -1;

    const renderLoop = () => {
      const contentBlock = document.querySelector(".original-content-block");
      if (!contentBlock) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      const scrollHeight = contentBlock.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      const totalFramesScrolled = scrollProgress * VIDEO_LOOPS_PER_PAGE * FRAME_COUNT;
      let frameIndex = Math.floor(totalFramesScrolled) % FRAME_COUNT;
      if (frameIndex < 0) frameIndex = 0;
      if (Number.isNaN(frameIndex)) frameIndex = 0;

      if (frameIndex !== lastFrameIndex && images[frameIndex]?.complete) {
        lastFrameIndex = frameIndex;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const img = images[frameIndex];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        context.drawImage(
          img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
        );
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
    </div>
  );
}
