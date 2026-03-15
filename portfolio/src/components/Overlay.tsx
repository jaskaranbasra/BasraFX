"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Section 1 Opacity: Fades in immediately, fades out between 10% and 20%
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Section 2 Opacity: Fades in between 20% and 30%, fades out between 40% and 50%
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);

  // Section 3 Opacity: Fades in between 60% and 70%, fades out between 80% and 90%
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.9], [50, -50]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 h-[500vh] w-full pointer-events-none"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        {/* Section 1 */}
        <motion.div
          style={{ opacity: opacity1, y: y1 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            BFX
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/70 font-light tracking-wide">
            Engineering Visual Excellence
          </p>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute inset-0 flex items-center justify-start pointer-events-auto max-w-7xl mx-auto px-6 w-full"
        >
          <div className="max-w-2xl bg-black/20 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              I build
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
                digital experiences.
              </span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Merging cutting-edge engineering with high-end aesthetic design to create interactive worlds on the web.
            </p>
          </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute inset-0 flex items-center justify-end pointer-events-auto max-w-7xl mx-auto px-6 w-full"
        >
          <div className="max-w-2xl bg-black/20 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl text-right">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              Bridging design
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
                and engineering.
              </span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Every interaction matters. Every pixel counts. Performance is a feature, and beauty is the baseline.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
