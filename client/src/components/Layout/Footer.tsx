export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6 mb-8">
          {/* Contact Information */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@rhythmicsouls.ai" className="hover:text-white transition-colors">
                info@rhythmicsouls.ai
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+919220460200" className="hover:text-white transition-colors">
                +91 92204 60200
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a 
              href="https://facebook.com/rhythmicsoulsai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors text-xl"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://twitter.com/rhythmicsoulsai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors text-xl"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="https://instagram.com/rhythmicsouls.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors text-xl"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://youtube.com/@rhythmicsoulsai"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors text-xl"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Rhythmic Souls AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
