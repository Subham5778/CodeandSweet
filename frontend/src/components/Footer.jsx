import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <footer className="bg-white shadow py-6 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <img src={logo} alt="logo" className="w-24" />
        <div className="text-center text-gray-700">
          <p>Made with 💗 to manage sweets smarter</p>
          <p>© 2025 Code & Sweet. All rights reserved. ✅</p>
        </div>
        <div className="text-center md:text-left text-gray-700">
          <p className="font-semibold">Contact Us</p>
          <p>📞 +91 00000 00000</p>
          <p>📍 Pune, Maharashtra, India</p>
        </div>
      </div>
    </footer>
  );
}
