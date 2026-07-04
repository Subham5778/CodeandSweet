import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const heroText = "Cacao & Confection";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (index < heroText.length) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev + heroText[index]);
        setIndex(index + 1);
      }, 100);
    } else {
      timer = setTimeout(() => {
        setDisplayText("");
        setIndex(0);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="relative text-center py-20 px-6 overflow-hidden cocoa-gradient border-b border-white/5">
      {/* Decorative luxury overlay spheres */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <span className="text-amber-500 uppercase tracking-widest text-xs font-mono font-semibold">
          ✨ Artisanal Masterpieces
        </span>

        <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tight leading-tight">
          Welcome to{" "}
          <span className="block mt-2 font-serif italic gold-text-gradient min-h-[1.2em]">
            {displayText}
            <span className="text-amber-500 animate-pulse">|</span>
          </span>
        </h2>

        <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed">
          Order delicious cakes, chocolates, and premium sweets online. Made fresh daily with the best quality ingredients.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => {
              const element = document.getElementById("shop-collection");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-900/20 transition duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
}
