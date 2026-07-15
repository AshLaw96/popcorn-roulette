import { Film } from 'lucide-react';
import useRoulette from './hooks/useRoulette';

import RouletteFilters from './components/RouletteFilters';
import RouletteSpinner from './components/RouletteSpinner';
import MovieCard from './components/MovieCard';
import StorageTrays from './components/StorageTrays';

export default function App() {
  // Call our single "brain" hook
  const roulette = useRoulette();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-8 px-4 font-sans antialiased">
      
      {/* HEADER */}
      <header className="text-center mb-10 max-w-md mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-3 bg-linear-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          <Film className="text-amber-400 w-8 h-8 sm:w-12 sm:h-12" /> POPCORN ROULETTE
        </h1>
        <p className="text-slate-400 mt-2 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          Premium Cinematic Selection Engine
        </p>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Filters Panel */}
        <RouletteFilters 
          loading={roulette.loading}
          genres={roulette.genres}
          selectedGenre={roulette.selectedGenre}
          setSelectedGenre={roulette.setSelectedGenre}
          year={roulette.year}
          setYear={roulette.setYear}
          actorQuery={roulette.actorQuery}
          setActorQuery={roulette.setActorQuery}
          actorResults={roulette.actorResults}
          setActorResults={roulette.setActorResults}
          selectedActor={roulette.selectedActor}
          setSelectedActor={roulette.setSelectedActor}
          directorQuery={roulette.directorQuery}
          setDirectorQuery={roulette.setDirectorQuery}
          directorResults={roulette.directorResults}
          setDirectorResults={roulette.setDirectorResults}
          selectedDirector={roulette.selectedDirector}
          setSelectedDirector={roulette.setSelectedDirector}
          minRating={roulette.minRating}
          setMinRating={roulette.setMinRating}
          maxRuntime={roulette.maxRuntime}
          setMaxRuntime={roulette.setMaxRuntime}
          onRoll={roulette.handleRollRoulette}
          handlePersonSearch={roulette.handlePersonSearch}
        />

        {/* Dynamic Roulette Output Panel */}
        <section className="lg:col-span-8 bg-slate-900/30 backdrop-blur-xl border border-slate-800/80 min-h-115 rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden w-full">
          {roulette.error && (
            <div className="text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-xl text-center max-w-sm">
              {roulette.error}
            </div>
          )}
          
          {/* Idle State */}
          {!roulette.movie && !roulette.error && !roulette.isSpinning && (
            <div className="text-center space-y-3 p-4">
              <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-2xl">🍿</div>
              <p className="text-xs sm:text-sm font-bold tracking-wider text-slate-400 uppercase">System Ready</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Adjust your configurations on the sidebar parameters panel and spin the generator wheel.
              </p>
            </div>
          )}

          {/* Animated Spinner Wheel */}
          {roulette.isSpinning && (
            <RouletteSpinner 
              isSpinning={roulette.isSpinning} 
              finalMovie={roulette.movie} 
              genres={roulette.genres} 
              selectedGenre={roulette.selectedGenre} 
            />
          )}

          {/* Movie Details Winner Card */}
          {roulette.movie && !roulette.isSpinning && (
            <MovieCard 
              movie={roulette.movie} 
              watchlist={roulette.watchlist} 
              toggleWatchlist={roulette.toggleWatchlist} 
              providers={roulette.providers} 
              cast={roulette.cast} 
              trailerKey={roulette.trailerKey}
            />
          )}
        </section>
      </main>

      {/* Storage & Logs Panel */}
      <StorageTrays 
        watchlist={roulette.watchlist} 
        toggleWatchlist={roulette.toggleWatchlist} 
        history={roulette.history} 
        setMovie={roulette.setMovie} 
        fetchMovieCast={roulette.fetchMovieCast} 
        fetchMovieProviders={roulette.fetchMovieProviders} 
      />
    </div>
  );
}