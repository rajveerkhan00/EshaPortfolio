export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black bg-[length:400%_400%] animate-bg-pan text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Logo / Name */}
          <div className="text-xl font-semibold text-white">
            <span className="text-indigo-500">Esha</span> Portfolio
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            <a href="#about" className="hover:text-indigo-400">About</a>
            <a href="#projects" className="hover:text-indigo-400">Projects</a>
            <a href="#skills" className="hover:text-indigo-400">Skills</a>
            <a href="#contact" className="hover:text-indigo-400">Contact</a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="https://github.com" className="hover:text-indigo-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2..." />
              </svg>
            </a>
            <a href="https://linkedin.com" className="hover:text-indigo-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.94 6.33..." />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Esha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
