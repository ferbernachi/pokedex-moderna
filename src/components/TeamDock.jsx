import React from 'react';

export default function TeamDock({ team, onRemove }) {
  const slots = Array(6).fill(null).map((_, i) => team[i] || null);

  return (
    <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40">
      <div className="bg-slate-900 bg-opacity-95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex flex-col items-center gap-4">
        
        {/* Encabezado */}
        <div className="writing-mode-vertical flex flex-col items-center gap-2 py-2">
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono font-bold">
              {team.length}/6
            </span>
            <div className="w-6 h-6 rounded-full border-2 border-slate-600 bg-slate-800"></div>
        </div>
        
        <div className="w-10 h-px bg-slate-700"></div>

        <div className="flex flex-col gap-4">
          {slots.map((pokemon, index) => (
            <div 
                key={index} 
                // AQUI ESTÁ EL CAMBIO: w-16 h-16 (64px) en móvil, w-20 h-20 (80px) en PC
                className="relative group w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-slate-800 rounded-full border-2 border-slate-700 transition-all hover:border-blue-500 hover:scale-110 shadow-lg"
            >
              {pokemon ? (
                <>
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    // CAMBIO: Menos padding (p-1) para que la imagen sea mas grande
                    className="w-full h-full object-contain p-1 drop-shadow-md"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(pokemon.id); }}
                    className="absolute -top-1 -right-1 z-50 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer border border-white"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="w-4 h-4 rounded-full bg-slate-700 opacity-50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}