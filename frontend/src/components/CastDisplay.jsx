import { Users } from 'lucide-react';

export default function CastDisplay({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="pt-2">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5 mb-2.5">
        <Users className="w-3 h-3 text-amber-400" /> Starring Cast
      </h4>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
        {cast.map(actor => (
          <div key={actor.id} className="flex items-center gap-2 bg-slate-950/50 border border-slate-800/60 px-2.5 py-1.5 rounded-xl text-left max-w-40 w-full">
            {actor.profile_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                alt={actor.name} 
                className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0" 
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                👤
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate leading-none">{actor.name}</p>
              <p className="text-[9px] text-slate-500 truncate mt-0.5">{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}