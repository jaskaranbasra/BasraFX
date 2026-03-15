"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

const CATEGORIES = [
  { 
    id: "video-editing", 
    label: "Video Editing", 
    subcategories: [
      { id: "documentary", label: "Documentary", folder: "video editing/documentary" },
      { id: "commercial-reel", label: "Commercial Reel", folder: "video editing/commercial reel" },
      { id: "motion-graphics", label: "Motion Graphics", folder: "video editing/motion graphics" },
      { id: "vfx", label: "VFX", folder: "video editing/vfx" },
    ]
  },
  { 
    id: "graphic", 
    label: "Graphic Chatores", 
    subcategories: [
      { id: "branding", label: "Branding", folder: "graphic/branding" },
      { id: "posters", label: "Posters", folder: "graphic/posters" },
      { id: "yt-thumbnail", label: "YT Thumbnail", folder: "graphic/yt thumbnail" },
      { id: "logo", label: "Logo", folder: "graphic/logo" },
    ]
  },
  { id: "3d", label: "3D Modeling", folder: "3d" },
  { id: "web", label: "Web Development", folder: "web development" },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const [activeSubTab, setActiveSubTab] = useState(CATEGORIES[0].subcategories![0].id);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Record<string, unknown> | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadCategoryItems() {
      setLoading(true);
      const category = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];
      
      let folderToFetch = category.folder;
      if (category.subcategories && activeSubTab) {
        const sub = category.subcategories.find(s => s.id === activeSubTab);
        if (sub) folderToFetch = sub.folder;
      }

      try {
        const response = await fetch(`/api/projects?category=${encodeURIComponent(folderToFetch || "")}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data.files || []);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryItems();
  }, [activeTab, activeSubTab]);

  return (
    <section className="relative w-full bg-[#121212] py-32 px-6 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Selected Work
            </h2>
            
            {/* Tabs Container */}
            <div className="flex flex-col gap-4 items-end">
              <div className="flex flex-wrap gap-2 justify-end">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveTab(category.id);
                      if (category.subcategories) {
                        setActiveSubTab(category.subcategories[0].id);
                      } else {
                        setActiveSubTab("");
                      }
                    }}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md shadow-lg ${
                      activeTab === category.id 
                        ? "bg-white text-black scale-105" 
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/5"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Subcategories */}
              <AnimatePresence>
                {CATEGORIES.find(c => c.id === activeTab)?.subcategories && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 justify-end overflow-hidden"
                  >
                    {CATEGORIES.find(c => c.id === activeTab)?.subcategories?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubTab(sub.id)}
                        className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-md ${
                          activeSubTab === sub.id 
                            ? "bg-white/30 text-white shadow-lg border border-white/40" 
                            : "bg-white/5 text-white/60 hover:bg-white/15 hover:text-white border border-white/10"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="h-[1px] w-full bg-white/10 mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
          <AnimatePresence mode="popLayout">
            {!loading && items.map((project, index) => (
              <motion.div
                key={project.id as React.Key}
                onClick={() => setSelectedProject(project)}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative block w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
              >
                {/* Dynamically render video or image */}
                {project.type === 'video' ? (
                  <video 
                    src={project.src as string}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${project.src as string}')` }}
                  />
                )}
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  {/* Top Bar inside card */}
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono tracking-widest text-white/80 uppercase backdrop-blur-md bg-black/40 border border-white/10 px-4 py-1.5 rounded-full">
                      {project.category as string}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-2xl">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-semibold tracking-tight text-white mb-2 truncate">
                      {project.title as string}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
            {!loading && items.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-white/50 border border-white/5 rounded-3xl"
              >
                No projects found in this category. Let&apos;s add some!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex items-center justify-center max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-50 shadow-lg border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              
              {selectedProject.type === 'video' ? (
                <video 
                  src={selectedProject.src as string}
                  autoPlay
                  controls
                  className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                />
              ) : (
                <img 
                  src={selectedProject.src as string}
                  alt={selectedProject.title as string}
                  className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
