export const BACKEND_URL = "http://127.0.0.1:8000/api";

/**
 * Submits roulette filters to the backend to pick a movie
 */
export const rollRoulette = async (filters) => {
  const payload = {
    genre: filters.selectedGenre ? filters.selectedGenre.toString() : null,
    year: filters.year ? parseInt(filters.year) : null,
    actor: filters.selectedActor ? filters.selectedActor.id.toString() : null,
    director: filters.selectedDirector ? filters.selectedDirector.id.toString() : null,
    min_rating: parseFloat(filters.minRating),
    max_runtime: parseInt(filters.maxRuntime)
  };

  const res = await fetch(`${BACKEND_URL}/roulette`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    // Standardize error messaging
    if (data.detail && typeof data.detail === 'object') {
      throw new Error(Array.isArray(data.detail) ? data.detail[0]?.msg : JSON.stringify(data.detail));
    }
    throw new Error(data.detail || 'No matching movies found.');
  }
  return data;
};

/**
 * Fetches top 5 cast members from TMDB
 */
export const fetchMovieCast = async (movieId, token) => {
  if (!token) return [];
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load cast");
  const data = await res.json();
  return data.cast.slice(0, 5);
};

/**
 * Fetches dynamic watch providers filtered by region
 */
export const fetchMovieProviders = async (movieId, token) => {
  if (!token) return null;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load streaming providers");
  const data = await res.json();
  return data.results?.GB || null;
};

/**
 * Live search for actors or directors
 */
export const searchPerson = async (query, type) => {
  if (query.length < 3) return [];
  const res = await fetch(`${BACKEND_URL}/search-person?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  
  const filtered = data.filter(p => {
    const dept = p.known_for_department?.toLowerCase() || "";
    return type === 'actor' 
      ? (dept.includes('act') || dept === '')
      : (dept.includes('direct') || dept.includes('crew') || dept.includes('writ'));
  });
  
  return filtered.length > 0 ? filtered : data;
};

/**
 * Fetches the official YouTube trailer key for a movie
 */
export const fetchMovieTrailerKey = async (movieId, token) => {
  if (!token) return null;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, {
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load movie videos");
  const data = await res.json();
  const videos = data.results || [];

  // Find an official YouTube trailer
  const officialTrailer = videos.find(
    v => v.site === 'YouTube' && v.type === 'Trailer' && v.official === true
  );
  
  // Fallback to any YouTube trailer if an official one isn't flagged
  const fallbackTrailer = videos.find(
    v => v.site === 'YouTube' && v.type === 'Trailer'
  );

  return officialTrailer?.key || fallbackTrailer?.key || null;
};