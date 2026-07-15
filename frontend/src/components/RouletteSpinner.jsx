import { useState, useEffect } from 'react';

// Fallback high-quality background images if TMDB poster fetches are blank
const FALLBACK_POSTERS = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80",
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&q=80"
];

export default function RouletteSpinner({ isSpinning, finalMovie, genres = [], selectedGenre }) {
  const [carouselPosters, setCarouselPosters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Resolve the active genre name dynamically to use our props!
  const activeGenreObj = genres.find(g => g.id.toString() === selectedGenre?.toString());
  const genreLabel = activeGenreObj ? `${activeGenreObj.name.toUpperCase()} ` : '';

  // 2. When spinning starts, populate a randomized queue of movie posters
  useEffect(() => {
    if (isSpinning) {
      // Create a pool of dummy/placeholder films to spin through
      const pool = Array.from({ length: 15 }, (_, i) => ({
        id: `temp-${i}`,
        poster_path: null,
        fallbackUrl: FALLBACK_POSTERS[i % FALLBACK_POSTERS.length]
      }));
      // Defer state update to avoid synchronous setState inside effect which can
      // cause cascading renders. Scheduling via setTimeout yields a separate
      // task tick so React can finish the current render first.
      const id = setTimeout(() => setCarouselPosters(pool), 0);
      return () => clearTimeout(id);
    }
  }, [isSpinning]);

  // 3. Control the cycling animation
  useEffect(() => {
    if (!isSpinning) return;

    let delay = 60; // Initial ultra-fast tick speed (ms)
    let timerId;

    const tick = () => {
      setActiveIndex((prev) => (prev + 1) % carouselPosters.length);

      // If the API finished loading the final selected movie, begin deceleration
      if (finalMovie) {
        delay += 45; // Gradually increase the delay to simulate friction/slowing down
      }

      // Once the wheel slows down to a near stop (e.g., > 450ms), snap to the final result
      if (delay > 450 && finalMovie) {
        // Replace current index with the actual winner's poster to finalize animation
        setCarouselPosters(prev => {
          const updated = [...prev];
          updated[activeIndex] = finalMovie;
          return updated;
        });
        return; 
      }

      timerId = setTimeout(tick, delay);
    };

    timerId = setTimeout(tick, delay);
    return () => clearTimeout(timerId);
  }, [isSpinning, finalMovie, carouselPosters.length, activeIndex]);

  if (!isSpinning || carouselPosters.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-sm mx-auto space-y-4">
      
      {/* Target Marker */}
      <div className="flex flex-col items-center">
        {/* Adjusted class slightly to support clean standard border styles */}
        <div className="w-0 h-0 border-l-10px border-l-transparent border-r-10px border-r-transparent border-t-12px border-t-amber-400 animate-bounce mb-2" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/80 text-center animate-pulse">
          Selecting {genreLabel}Movie...
        </span>
      </div>

      {/* Ribbon Frame */}
      <div className="w-full relative overflow-hidden bg-slate-950/80 border border-slate-800 rounded-2xl h-44 flex items-center shadow-inner">
        
        {/* Dynamic sliding track */}
        <div 
          className="flex gap-3 transition-transform duration-100 ease-out absolute px-[35%]"
          style={{ transform: `translateX(-${activeIndex * 108}px)` }}
        >
          {carouselPosters.map((item, idx) => {
            const isTarget = idx === activeIndex;
            const imgSrc = item.poster_path 
              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
              : item.fallbackUrl;

            return (
              <div 
                key={item.id} 
                className={`w-24 aspect-2/3 shrink-0 rounded-lg overflow-hidden border transition-all duration-150 ${
                  isTarget 
                    ? 'border-amber-400 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.3)] opacity-100' 
                    : 'border-slate-800 opacity-30 scale-95'
                }`}
              >
                <img 
                  src={imgSrc} 
                  alt="Spinner Card" 
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-slate-950/90 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-slate-950/90 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}