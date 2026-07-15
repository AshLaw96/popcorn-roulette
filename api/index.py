import os
import random
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

# Load values from the hidden .env file
load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

# 🛠️ State Management: Keep a single, reusable AsyncClient for the app lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the client with base parameters
    app.state.client = httpx.AsyncClient(base_url=BASE_URL, headers=HEADERS)
    yield
    # Shutdown: Clean up sockets cleanly
    await app.state.client.aclose()

app = FastAPI(title="Popcorn Roulette API", version="1.0.0", lifespan=lifespan)

# 🔒 SECURITY SETUP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dynamically set maximum allowed year to the current year (currently 2026)
CURRENT_YEAR = datetime.now().year

class MovieFilterRequest(BaseModel):
    genre: Optional[str] = None
    year: Optional[int] = Field(None, ge=1900, le=CURRENT_YEAR)
    actor: Optional[str] = None
    director: Optional[str] = None
    min_rating: Optional[float] = Field(5.0, ge=0.0, le=10.0)
    max_runtime: Optional[int] = Field(180, ge=30, le=300)

async def get_person_id(client: httpx.AsyncClient, name: str) -> Optional[int]:
    """Helper async function to convert full text names to internal TMDB profile IDs."""
    if not name:
        return None
    try:
        response = await client.get("/search/person", params={"api_key": API_KEY, "query": name})
        results = response.json().get("results", [])
        return results[0]["id"] if results else None
    except httpx.HTTPError:
        return None

@app.get("/api/genres")
async def fetch_genres():
    """Returns official TMDB movie genre mappings directly to the client UI."""
    client: httpx.AsyncClient = app.state.client
    try:
        response = await client.get("/genre/movie/list", params={"api_key": API_KEY, "language": "en"})
        response.raise_for_status()
        return response.json().get("genres", [])
    except httpx.HTTPError:
        raise HTTPException(status_code=500, detail="Failed to pull indices from TMDB.")

@app.get("/api/search-person")
async def search_person(query: str):
    """
    Searches TMDB for an actor or director by name and returns their ID and profile.
    """
    if not query:
        return []
    
    client: httpx.AsyncClient = app.state.client
    try:
        response = await client.get(
            "/search/person",
            params={"api_key": API_KEY, "query": query, "include_adult": "false"}
        )
        response.raise_for_status()
        results = response.json().get("results", [])
        
        return [
            {
                "id": person["id"],
                "name": person["name"],
                "known_for_department": person.get("known_for_department", "")
            }
            # Limit to top 5 matches
            for person in results[:5] 
        ]
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=500, detail="Failed to query TMDB person database.")

@app.post("/api/roulette")
async def roll_movie_roulette(filters: MovieFilterRequest):
    """Processes search properties, checks filters safely, and returns a randomised title choice."""
    client: httpx.AsyncClient = app.state.client
    
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

    # Check actor constraints
    if filters.actor:
        if filters.actor.isdigit():
            params["with_cast"] = filters.actor
        else:
            actor_id = await get_person_id(client, filters.actor)
            if actor_id: 
                params["with_cast"] = actor_id
        
    # Check director constraints
    if filters.director:
        if filters.director.isdigit():
            params["with_crew"] = filters.director
        else:
            director_id = await get_person_id(client, filters.director)
            if director_id: 
                params["with_crew"] = director_id

    # Call external API network pool safely
    try:
        response = await client.get("/discover/movie", params=params)
        response.raise_for_status()
        data = response.json()
        movies = data.get("results", [])
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Error communicating with upstream TMDB service.")
    
    if not movies:
        raise HTTPException(status_code=404, detail="No films found matching those parameters.")
        
    return random.choice(movies)