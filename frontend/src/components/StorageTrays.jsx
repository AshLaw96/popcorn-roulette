import { BookmarkPlus, BookmarkX, History } from 'lucide-react';

export default function StorageTrays({ 
  watchlist, 
  toggleWatchlist, 
  history, 
  setMovie, 
  fetchMovieCast,
  fetchMovieProviders
}) {
  const handleHistoryClick = (m) => {
    setMovie(m);
    if (m.id) {
      fetchMovieCast(m.id);
      fetchMovieProviders?.(m.id); // Guard against missing fetcher
    }
  };

  return (
    <footer className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      {/* WATCHLIST TRAY */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800/60 pb-2">
          <BookmarkPlus className="w-3.5 h-3.5" /> Bookmarked Watchlist ({watchlist.length})
        </h3>
        
        {watchlist.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">No movies bookmarked inside local storage.</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
            {watchlist.map(m => (
              <div 
                key={m.id} 
                className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 text-xs text-slate-300"
              >
                <span className="truncate font-medium max-w-[85%]">{m.title}</span>
                <button 
                  onClick={() => toggleWatchlist(m)} 
                  className="text-slate-500 hover:text-red-400 p-0.5 transition-colors"
                  aria-label="Remove from watchlist"
                >
                  <BookmarkX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENT LOG TRAY */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800/60 pb-2">
          <History className="w-3.5 h-3.5" /> Recent Generations Log
        </h3>
        
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">Roll log history empty.</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
            {history.map((m, idx) => (
              <button 
                key={`${m.id}-${idx}`} 
                onClick={() => handleHistoryClick(m)} 
                className="w-full text-left flex items-center gap-2 bg-slate-950/20 hover:bg-slate-950/80 p-2 rounded-xl transition-all border border-transparent hover:border-slate-800/80 text-xs text-slate-400 hover:text-slate-200"
              >
                <span className="text-amber-500 font-extrabold bg-amber-500/5 px-1.5 py-0.5 rounded text-[10px]">
                  #{idx + 1}
                </span>
                <span className="truncate">{m.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}