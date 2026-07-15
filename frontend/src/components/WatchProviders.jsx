export default function WatchProviders({ providers }) {
  // If no provider data exists for this region
  if (!providers) {
    return (
      <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-3 text-center">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Streaming data unavailable for your region
        </span>
      </div>
    );
  }

  // Helper to safely extract provider logos
  const getProviderGroup = (type) => {
    return providers[type] || [];
  };

  const flatrate = getProviderGroup('flatrate'); // Subscription stream services (Netflix, Prime, etc.)
  const rent = getProviderGroup('rent');         // Rental options (Apple TV, Google Play)
  const buy = getProviderGroup('buy');           // Direct purchase options

  const hasAnyProviders = flatrate.length > 0 || rent.length > 0 || buy.length > 0;

  if (!hasAnyProviders) {
    return (
      <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-3 text-center">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          Not currently streaming online
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4.5">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400/90">
        Where to Watch (UK)
      </h4>

      <div className="space-y-2.5">
        {/* 1. Subscription Streaming */}
        {flatrate.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0">Stream:</span>
            <div className="flex flex-wrap gap-1.5">
              {flatrate.map((p) => (
                <div 
                  key={p.provider_id} 
                  className="group relative w-7 h-7 rounded-lg overflow-hidden border border-slate-800/80 hover:border-amber-400/40 transition-colors"
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                    alt={p.provider_name} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-800 pointer-events-none z-10 shadow-lg">
                    {p.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Rent Options */}
        {rent.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 w-12 shrink-0">Rent:</span>
            <div className="flex flex-wrap gap-1.5">
              {rent.slice(0, 5).map((p) => (
                <div 
                  key={p.provider_id} 
                  className="group relative w-7 h-7 rounded-lg overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/original${p.logo_path}`} 
                    alt={p.provider_name} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-800 pointer-events-none z-10 shadow-lg">
                    {p.provider_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}