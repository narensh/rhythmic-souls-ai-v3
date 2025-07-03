export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
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
        <div className="mt-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Rhythmic Souls AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
