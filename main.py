import os
import random
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field  # 🌟 FIXED: Field is safely imported from pydantic now!
from typing import Optional
from dotenv import load_dotenv
import httpx

# Load values from the hidden .env file
load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

app = FastAPI(title="Popcorn Roulette API", version="1.0.0")

# 🔒 SECURITY SETUP: Allow React app to speak safely to Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any local port to read the stream cleanly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define what fields API strictly expects using a Pydantic Model
class MovieFilterRequest(BaseModel):
    genre: Optional[str] = None
    year: Optional[int] = Field(None, ge=1900, le=2026)
    actor: Optional[str] = None
    director: Optional[str] = None
    min_rating: Optional[float] = Field(5.0, ge=0.0, le=10.0)
    max_runtime: Optional[int] = Field(180, ge=30, le=300)

def get_person_id(name: str) -> Optional[int]:
    """Helper proxy function to convert full text names to internal TMDB profile IDs."""
    if not name:
        return None
    url = f"{BASE_URL}/search/person"
    response = requests.get(url, params={"api_key": API_KEY, "query": name}, headers=HEADERS)
    results = response.json().get("results", [])
    return results[0]["id"] if results else None

@app.get("/api/genres")
def fetch_genres():
    """Returns official TMDB movie genre mappings directly to the client UI."""
    url = f"{BASE_URL}/genre/movie/list"
    response = requests.get(url, params={"api_key": API_KEY, "language": "en"}, headers=HEADERS)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to pull indices from TMDB.")
    return response.json().get("genres", [])

@app.get("/api/search-person")
async def search_person(query: str):
    """
    Searches TMDB for an actor or director by name and returns their ID and profile.
    """
    if not query:
        return []
        
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BASE_URL}/search/person",
                headers=HEADERS,
                params={"api_key": API_KEY, "query": query, "include_adult": "false"}
            )
            response.raise_for_status()
            results = response.json().get("results", [])
            
            # Extract just the useful info: name, id, and what they are known for
            return [
                {
                    "id": person["id"],
                    "name": person["name"],
                    "known_for_department": person.get("known_for_department", "")
                }
                for person in results[:5] # Limit to top 5 matches
            ]
        except httpx.HTTPStatusError:
            raise HTTPException(status_code=500, detail="Failed to query TMDB person database.")

@app.post("/api/roulette")
def roll_movie_roulette(filters: MovieFilterRequest):
    """Processes search properties, checks filters safely, and returns a randomised title choice."""
    discover_url = f"{BASE_URL}/discover/movie"
    
    # Establish production-grade baseline constraints
    params = {
        "api_key": API_KEY,
        "include_adult": "false",
        "language": "en-US",
        "vote_count.gte": 100,  # Strips out backyard movies or empty ratings
        "vote_average.gte": filters.min_rating,
        "with_runtime.lte": filters.max_runtime
    }
    
    if filters.genre:
        params["with_genres"] = filters.genre
    if filters.year:
        params["primary_release_year"] = filters.year

    # If the user selected an autocomplete item, our React app sends the ID string directly.
    # If it is numeric, we skip text lookup entirely!
    if filters.actor:
        if filters.actor.isdigit():
            params["with_cast"] = filters.actor
        else:
            actor_id = get_person_id(filters.actor)
            if actor_id: params["with_cast"] = actor_id
        
    if filters.director:
        if filters.director.isdigit():
            params["with_crew"] = filters.director
        else:
            director_id = get_person_id(filters.director)
            if director_id: params["with_crew"] = director_id

    # Call external API network pool safely
    response = requests.get(discover_url, params=params, headers=HEADERS)
    data = response.json()
    movies = data.get("results", [])
    
    if not movies:
        raise HTTPException(status_code=404, detail="No films found matching those parameters.")
        
    return random.choice(movies)