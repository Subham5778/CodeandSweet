import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const heroText = "Code & Sweet";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (index < heroText.length) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev + heroText[index]);
        setIndex(index + 1);
      }, 120);
    } else {
      timer = setTimeout(() => {
        setDisplayText("");
        setIndex(0);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="text-center py-14 px-4">
      <h2 className="text-4xl font-bold mb-4">
        Welcome to{" "}
        <motion.span
          className="text-pink-600 inline-block min-w-[10ch]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {displayText}
          <span className="animate-pulse">|</span>
        </motion.span>
      </h2>
      <p className="max-w-2xl mx-auto text-gray-600">
        Where creativity meets code and sweetness meets simplicity.
        Every treat is crafted with care — just like clean, beautiful code.
      </p>
      <p className="mt-4 text-gray-600">
        Explore our sweet collection and enjoy a space designed to make your
        day a little softer, happier and sweeter.
      </p>
      <p className="mt-4 font-semibold text-gray-700">
        Because here, sweetness isn’t just served — it’s engineered.
      </p>
    </section>
  );
}
