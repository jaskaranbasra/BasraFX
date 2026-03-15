import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import About from "@/components/About";

export default function Home() {
  return (
    <main className="relative w-full bg-[#121212] flex flex-col min-h-screen selection:bg-white/30 selection:text-white">
      {/* 
        The primary scrollytelling section. 
        It reserves 500vh of space. The canvas and overlay are sticky inside.
      */}
      <div className="relative h-[500vh] w-full">
        <ScrollyCanvas />
        <Overlay />
      </div>

      {/* 
        Content that appears after the user has finished the 500vh scroll.
        Z-index ensures it sits above the fixed background.
      */}
      <div className="relative z-10 w-full bg-[#121212]">
        <Projects />
        <About />
        
        <footer className="w-full py-12 text-center text-white/30 text-sm bg-[#121212] relative z-20 border-t border-white/5 mt-10">
          <p>© {new Date().getFullYear()} BFX. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
