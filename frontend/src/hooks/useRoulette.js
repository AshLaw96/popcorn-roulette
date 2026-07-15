import { useState, useEffect } from 'react';
import { 
  rollRoulette, 
  fetchMovieCast, 
  fetchMovieProviders,
  fetchMovieTrailerKey, 
  searchPerson, 
  BACKEND_URL 
} from '../services/movieApi';

export default function useRoulette() {
  // App Filter States
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState(6.0);
  const [maxRuntime, setMaxRuntime] = useState(180);
  
  // Person Search States
  const [actorQuery, setActorQuery] = useState('');
  const [actorResults, setActorResults] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  
  const [directorQuery, setDirectorQuery] = useState('');
  const [directorResults, setDirectorResults] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);

  // Core Output States
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState('');
  const [trailerKey, setTrailerKey] = useState(null);

  // Watchlist and History Storage States
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('popcorn_watchlist')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('popcorn_history')) || []);

  const TMDB_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || window.__TMDB_TOKEN__;

  // Sync Local Storage
  useEffect(() => { localStorage.setItem('popcorn_watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('popcorn_history', JSON.stringify(history)); }, [history]);

  // Initial Sync for Genres
  useEffect(() => {
    fetch(`${BACKEND_URL}/genres`)
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(() => setError('Could not sync with the core engine. Check terminal logs!'));
  }, []);

  const handlePersonSearch = async (query, type, setResults) => {
    try {
      const results = await searchPerson(query, type);
      setResults(results);
    } catch {
      console.error("Autocomplete failure.");
    }
  };

  const handleRollRoulette = async () => {
    setLoading(true);
    setIsSpinning(true);
    setError('');
    setMovie(null);
    setCast([]);
    setProviders(null);

    try {
      const movieData = await rollRoulette({ selectedGenre, year, selectedActor, selectedDirector, minRating, maxRuntime });
      setMovie(movieData);
      setHistory(prev => [movieData, ...prev.filter(h => h.id !== movieData.id)].slice(0, 5));

      if (movieData.id) {
        const [castData, providerData, trailerData] = await Promise.all([
          fetchMovieCast(movieData.id, TMDB_TOKEN),
          fetchMovieProviders(movieData.id, TMDB_TOKEN),
          fetchMovieTrailerKey(movieData.id, TMDB_TOKEN)
        ]);
        setCast(castData);
        setProviders(providerData);
        setTrailerKey(trailerData);
      }

      setTimeout(() => {
        setIsSpinning(false);
        setLoading(false);
      }, 2500);

    } catch (err) {
      setError(err.message || 'Failed to reach server backend.');
      setIsSpinning(false);
      setLoading(false);
    }
  };

  const toggleWatchlist = (targetMovie) => {
    if (watchlist.some(w => w.id === targetMovie.id)) {
      setWatchlist(prev => prev.filter(w => w.id !== targetMovie.id));
    } else {
      setWatchlist(prev => [targetMovie, ...prev]);
    }
  };

  // Return everything App.jsx needs to connect to the UI
  return {
    // States
    genres, selectedGenre, setSelectedGenre,
    year, setYear,
    minRating, setMinRating,
    maxRuntime, setMaxRuntime,
    actorQuery, setActorQuery,
    actorResults, setActorResults,
    selectedActor, setSelectedActor,
    directorQuery, setDirectorQuery,
    directorResults, setDirectorResults,
    selectedDirector, setSelectedDirector,
    movie, setMovie,
    cast, setCast,
    providers, setProviders,
    trailerKey, setTrailerKey,
    loading, isSpinning, error, setError,
    watchlist, history,
    TMDB_TOKEN,

    // Actions
    handlePersonSearch,
    handleRollRoulette,
    toggleWatchlist,
    fetchMovieCast: (id) => fetchMovieCast(id, TMDB_TOKEN).then(setCast),
    fetchMovieProviders: (id) => fetchMovieProviders(id, TMDB_TOKEN).then(setProviders),
    fetchMovieTrailerKey: (id) => fetchMovieTrailerKey(id, TMDB_TOKEN).then(setTrailerKey)
  };
}