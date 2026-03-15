"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 120;
const PUBLIC_DIR_PREFIX = "/sequence/frame_";
const PADDED_NUMBER_LENGTH = 3;
const DELAY_SUFFIX = "_delay-0.066s.png";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesRef, setImagesRef] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Preload Images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(PADDED_NUMBER_LENGTH, "0");
        img.src = `${PUBLIC_DIR_PREFIX}${paddedIndex}${DELAY_SUFFIX}`;
        
        img.onload = () => {
            loadedCount++;
            if (loadedCount === TOTAL_FRAMES) {
                setImagesRef(images);
                setIsLoaded(true);
            }
        };
        images.push(img);
    }
  }, []);

  // 2. Framer Motion Scroll Mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // 3. Draw on Canvas
  const renderFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef[index]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef[index];

    // Responsive Canvas Resizing & Object Fit Cover Logic
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      // Screen is wider than image aspect ratio (e.g. Desktop wide) -> scale height to fit width
      renderHeight = renderWidth / imgRatio;
    } else {
      // Screen is taller than image aspect ratio (e.g. Mobile portrait) -> scale width to fit height
      renderWidth = renderHeight * imgRatio;
    }

    // Apply 10% zoom
    const zoomFactor = 1.1;
    renderWidth *= zoomFactor;
    renderHeight *= zoomFactor;

    offsetX = (canvas.width - renderWidth) / 2;
    offsetY = (canvas.height - renderHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (isLoaded) {
      renderFrame(Math.round(latest));
    }
  });

  // Render initial frame on mount
  useEffect(() => {
    if (isLoaded) {
      renderFrame(0);
    }
  }, [isLoaded]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (isLoaded) {
            renderFrame(Math.round(frameIndex.get()));
        }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, frameIndex]);

  // Lock body scroll while loading
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#121212]">
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
                Loading Experience...
            </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
