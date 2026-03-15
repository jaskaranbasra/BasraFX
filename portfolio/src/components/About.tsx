"use client";

import { motion } from "framer-motion";
import { Instagram, Youtube, Mail } from "lucide-react";

export default function About() {
  const links = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/basrafx/",
      color: "hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com",
      color: "hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:hello@example.com",
      color: "hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10",
    },
  ];

  return (
    <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center py-24 bg-[#121212]">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-[100%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 mb-6">
            Jaskaran Singh Basra
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            I'm a visual artist and developer passionate about creating immersive digital experiences. 
            Let's connect and build something extraordinary together.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {links.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-300 ${link.color}`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon className="w-6 h-6" />
              <span className="font-medium">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
