import { useEffect } from 'react';

export default function TrailerModal({ isOpen, onClose, youtubeKey, title }) {
  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !youtubeKey) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the video panel
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <h3 className="text-white font-semibold text-lg truncate pr-4">
            {title ? `${title} — Official Trailer` : 'Play Trailer'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 p-2 rounded-full border border-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Responsive Wrapper (Aspect Ratio 16:9) */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>
      </div>
    </div>
  );
}