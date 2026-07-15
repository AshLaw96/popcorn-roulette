import { useState } from 'react';
import { Calendar, Star, Video, BookmarkPlus } from 'lucide-react';
import WatchProviders from './WatchProviders';
import CastDisplay from './CastDisplay';
import TrailerModal from './TrailerModal';

export default function MovieCard({ 
  movie, 
  watchlist, 
  toggleWatchlist, 
  providers, 
  cast,
  trailerKey
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!movie) return null;
  const isBookmarked = watchlist.some(w => w.id === movie.id);
  const releaseYear = movie.release_date?.substring(0, 4) || 'N/A';
  
  // Kept as a fallback search query in case a direct API trailer isn't found
  const youtubeSearchQuery = encodeURIComponent(
    `${movie.title || ''} ${releaseYear} official trailer`
  );

  const formattedRating = typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div className="w-full flex flex-col sm:flex-row gap-6 items-center sm:items-start animate-fade-in">
      
      {/* Poster Frame */}
      <div className="w-40 sm:w-48 shrink-0 rounded-xl border border-slate-800 shadow-2xl overflow-hidden aspect-2/3 bg-slate-950">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600 p-4 text-center">
            <span className="text-3xl mb-1">🎬</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">No Poster</span>
          </div>
        )}
      </div>
      
      {/* Descriptions, Actions & Extracted Sub-Components */}
      <div className="flex-1 space-y-4 text-center sm:text-left w-full">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {movie.title}
          </h2>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {releaseYear}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-400" /> {formattedRating} / 10
            </span>
          </div>
        </div>
        
        <hr className="border-slate-800/60" />
        
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
          {movie.overview || "No plot overview available."}
        </p>

        {/* Dynamic Watch Providers Block */}
        <WatchProviders providers={providers} />

        {/* Dynamic Starring Cast Block */}
        <CastDisplay cast={cast} />
        
        {/* Button Control Tray */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {trailerKey ? (
            /* 1. If trailerKey is present, open the embedded Trailer Modal */
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 cursor-pointer"
            >
              <Video className="w-4 h-4" /> Watch Official Trailer
            </button>
          ) : (
            /* 2. Fallback: If no direct key exists, fall back to searching on YouTube */
            <a 
              href={`https://www.youtube.com/results?search_query=${youtubeSearchQuery}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-slate-950/60 hover:bg-slate-850 text-amber-400 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition border border-slate-800 flex items-center justify-center gap-2 hover:border-amber-500/20"
            >
              <Video className="w-4 h-4" /> Search Trailer on YouTube
            </a>
          )}
          
          <button 
            onClick={() => toggleWatchlist(movie)} 
            className={`p-2.5 rounded-xl border transition text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isBookmarked ? 'Saved' : 'Watchlist'}</span>
          </button>
        </div>

        {/* Dynamic Modal Component */}
        <TrailerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          youtubeKey={trailerKey} 
          title={movie.title} 
        />
      </div>
    </div>
  );
}