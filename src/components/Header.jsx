import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black bg-[length:400%_400%] animate-bg-pan text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <div className="text-2xl font-bold">
          <span className="text-indigo-500">Esha</span> Portfolio
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <a href="#about" className="hover:text-indigo-400">About</a>
          <a href="#projects" className="hover:text-indigo-400">Projects</a>
          <a href="#skills" className="hover:text-indigo-400">Skills</a>
          <a href="#contact" className="hover:text-indigo-400">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:text-indigo-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isOpen
                  ? "M6 18L18 6M6 6l12 12" // X icon
                  : "M4 6h16M4 12h16M4 18h16"} // Hamburger
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black px-4 pb-4 space-y-2 font-medium">
          <a href="#about" className="block hover:text-indigo-400">About</a>
          <a href="#projects" className="block hover:text-indigo-400">Projects</a>
          <a href="#skills" className="block hover:text-indigo-400">Skills</a>
          <a href="#contact" className="block hover:text-indigo-400">Contact</a>
        </div>
      )}
    </header>
  );
}
