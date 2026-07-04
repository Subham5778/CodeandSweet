import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <footer className="glass border-t border-white/5 py-8 px-6 mt-16 text-neutral-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <div>
            <p className="font-serif font-bold text-amber-200 text-sm">Cacao & Confection</p>
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono">Artisanal Confections</p>
          </div>
        </div>

        <div className="text-center text-xs space-y-1">
          <p>Made with 💗 to engineer sweetness smarter</p>
          <p>© 2026 Cacao & Confection. All rights reserved.</p>
        </div>

        <div className="text-center md:text-right text-xs space-y-1">
          <p className="font-semibold text-neutral-300">Boutique Inquiries</p>
          <p>📞 +91 99999 99999</p>
          <p>📍 Pune, Maharashtra, India</p>
        </div>
      </div>
    </footer>
  );
}
