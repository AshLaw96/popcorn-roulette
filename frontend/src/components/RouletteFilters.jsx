import { Sliders, User, Video } from 'lucide-react';

export default function RouletteFilters({
  loading,
  genres,
  selectedGenre,
  setSelectedGenre,
  year,
  setYear,
  actorQuery,
  setActorQuery,
  actorResults,
  setActorResults,
  selectedActor,
  setSelectedActor,
  directorQuery,
  setDirectorQuery,
  directorResults,
  setDirectorResults,
  selectedDirector,
  setSelectedDirector,
  minRating,
  setMinRating,
  maxRuntime,
  setMaxRuntime,
  onRoll,
  handlePersonSearch
}) {
  return (
    <section className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
      <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider border-b border-slate-800/80 pb-3">
        <Sliders className="w-4 h-4" /> Filter Parameters
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Genre</label>
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)} 
            className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="">Any Genre</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Release Year</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            placeholder="e.g. 2014" 
            className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:border-amber-500/50" 
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* ACTOR SELECTOR */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-500" /> Star Actor / Actress Filter
          </label>
          {selectedActor ? (
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-sm text-amber-400 font-medium">
              <span>{selectedActor.name}</span>
              <button onClick={() => { setSelectedActor(null); setActorQuery(''); }} className="text-xs font-bold hover:text-amber-300 px-1">✕</button>
            </div>
          ) : (
            <input 
              type="text" 
              value={actorQuery} 
              onChange={(e) => { 
                setActorQuery(e.target.value); 
                handlePersonSearch(e.target.value, 'actor', setActorResults); 
              }} 
              placeholder="Search specific star actor..." 
              className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:border-amber-500/50" 
            />
          )}
          {actorResults.length > 0 && !selectedActor && (
            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
              {actorResults.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => { setSelectedActor(p); setActorResults([]); }} 
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800/80 text-slate-300 border-b border-slate-800/50 last:border-0"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DIRECTOR SELECTOR */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Video className="w-3 h-3 text-slate-500" /> Director Filter
          </label>
          {selectedDirector ? (
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-sm text-amber-400 font-medium">
              <span>{selectedDirector.name}</span>
              <button onClick={() => { setSelectedDirector(null); setDirectorQuery(''); }} className="text-xs font-bold hover:text-amber-300 px-1">✕</button>
            </div>
          ) : (
            <input 
              type="text" 
              value={directorQuery} 
              onChange={(e) => { 
                setDirectorQuery(e.target.value); 
                handlePersonSearch(e.target.value, 'director', setDirectorResults); 
              }} 
              placeholder="Search directors..." 
              className="w-full bg-slate-950/80 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-sm focus:outline-none focus:border-amber-500/50" 
            />
          )}
          {directorResults.length > 0 && !selectedDirector && (
            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
              {directorResults.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => { setSelectedDirector(p); setDirectorResults([]); }} 
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800/80 text-slate-300 border-b border-slate-800/50 last:border-0"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SLIDERS */}
      <div className="space-y-4 pt-2">
        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Minimum Rating</span>
            <span className="text-amber-400 font-bold">{minRating.toFixed(1)} ⭐</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={minRating} 
            onChange={(e) => setMinRating(parseFloat(e.target.value))} 
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Maximum Runtime</span>
            <span className="text-amber-400 font-bold">{maxRuntime} mins ⏱️</span>
          </div>
          <input 
            type="range" 
            min="60" 
            max="240" 
            step="10" 
            value={maxRuntime} 
            onChange={(e) => setMaxRuntime(parseInt(e.target.value))} 
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
          />
        </div>
      </div>

      <button 
        onClick={onRoll} 
        disabled={loading} 
        className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 rounded-xl shadow-lg text-sm tracking-wider uppercase mt-3 disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? "Selecting..." : "🎰 Roll Film Roulette"}
      </button>
    </section>
  );
}