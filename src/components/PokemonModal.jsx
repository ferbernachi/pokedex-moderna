import React, { useEffect, useState } from 'react';

const typeColorMap = {
  fire: 'bg-red-500', water: 'bg-blue-500', grass: 'bg-green-500',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600', dark: 'bg-gray-800', fairy: 'bg-pink-300',
  normal: 'bg-gray-400', fighting: 'bg-orange-700', flying: 'bg-sky-400',
  poison: 'bg-purple-500', ground: 'bg-amber-600', rock: 'bg-stone-500',
  bug: 'bg-lime-500', ghost: 'bg-indigo-900', steel: 'bg-slate-400',
};

// AHORA RECIBIMOS 'isTeamMember' y 'onToggleTeam'
export default function PokemonModal({ pokemon, onClose, isTeamMember, onToggleTeam }) {
  const [description, setDescription] = useState('Cargando...');
  const [weaknesses, setWeaknesses] = useState([]);
  const [evolutionChain, setEvolutionChain] = useState([]); 

  useEffect(() => {
    if (!pokemon) return;

    const fetchData = async () => {
      try {
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();

        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'es') 
                   || speciesData.flavor_text_entries.find(e => e.language.name === 'en');
        setDescription(entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'Sin descripción.');

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();

        const chain = [];
        let current = evolutionData.chain;
        while (current) {
            const speciesName = current.species.name;
            const id = current.species.url.split('/').slice(-2, -1)[0]; 
            chain.push({
                name: speciesName,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            });
            current = current.evolves_to[0];
        }
        setEvolutionChain(chain);

        const typesPromises = pokemon.types.map(t => fetch(t.type.url).then(res => res.json()));
        const typesData = await Promise.all(typesPromises);
        const allWeaknesses = new Set();
        typesData.forEach(typeInfo => {
          typeInfo.damage_relations.double_damage_from.forEach(damageType => {
            allWeaknesses.add(damageType.name);
          });
        });
        setWeaknesses(Array.from(allWeaknesses));

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [pokemon]);

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const barColor = typeColorMap[mainType] || 'bg-blue-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-lg"
        >
          ✕
        </button>

        <div className={`h-32 w-full ${barColor} opacity-80 absolute top-0 left-0 z-0`}></div>
        
        <div className="relative z-10 pt-10 flex flex-col items-center">
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default} 
            alt={pokemon.name}
            className="w-48 h-48 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="p-6 pt-2 pb-24"> {/* Extra padding bottom para que no tape el Dock */}
          <h2 className="text-4xl font-extrabold text-center capitalize text-slate-800 mb-2 drop-shadow-sm">
            {pokemon.name}
          </h2>

          {/* BOTÓN DE ACCIÓN: AÑADIR/QUITAR EQUIPO */}
          <div className="flex justify-center mb-6">
            <button
                onClick={() => onToggleTeam(pokemon)}
                className={`px-6 py-2 rounded-full font-bold shadow-lg transform transition-all hover:scale-105 flex items-center gap-2 ${
                    isTeamMember 
                    ? 'bg-red-100 text-red-600 border-2 border-red-200' 
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
            >
                {isTeamMember ? (
                    <>💔 Quitar del Equipo</>
                ) : (
                    <>❤️ Añadir al Equipo</>
                )}
            </button>
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
             {pokemon.types.map(t => (
               <span key={t.type.name} className={`px-4 py-1 text-white rounded-full text-sm font-bold capitalize shadow-md ${typeColorMap[t.type.name] || 'bg-gray-400'}`}>
                 {t.type.name}
               </span>
             ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-center text-slate-600 italic leading-relaxed shadow-inner">
            "{description}"
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-slate-700 text-lg mb-2 text-center">Débil contra</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {weaknesses.map(type => (
                <span key={type} className={`px-3 py-1 text-white rounded-lg text-xs font-bold capitalize shadow-sm ${typeColorMap[type] || 'bg-gray-400'}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          {evolutionChain.length > 1 && (
            <div className="mb-8">
                <h3 className="font-bold text-slate-700 text-lg mb-4 text-center">Línea Evolutiva</h3>
                <div className="flex items-center justify-center gap-4">
                    {evolutionChain.map((evo, index) => (
                        <div key={evo.name} className="flex items-center">
                            <div className="flex flex-col items-center group">
                                <div className={`w-16 h-16 rounded-full border-2 ${evo.name === pokemon.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} p-1 overflow-hidden relative`}>
                                    <img src={evo.image} alt={evo.name} className="w-full h-full object-contain" />
                                </div>
                                <span className={`text-xs mt-1 capitalize font-bold ${evo.name === pokemon.name ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {evo.name}
                                </span>
                            </div>
                            {index < evolutionChain.length - 1 && (
                                <span className="mx-2 text-gray-300 font-bold text-xl">→</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 text-lg mb-2">Estadísticas Base</h3>
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="flex items-center text-sm">
                <span className="w-24 capitalize text-gray-500 font-bold">{s.stat.name.replace('-', ' ')}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden ml-2 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${Math.min(s.base_stat, 100)}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right font-bold text-gray-700">{s.base_stat}</span>
              </div>
            ))}
          </div>
          {/* SECCIÓN: ANÁLISIS DE PODER (Inspirado en POKEMON HOBERENA del PDF) */}
<div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
  <h3 className="font-bold text-yellow-800 text-lg mb-2 flex items-center gap-2">
    ⭐ Análisis de Poder
  </h3>
  {(() => {
    const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);
    let rank = "Normal";
    if (totalStats > 580) rank = "Legendario / Pseudo-Legendario";
    else if (totalStats > 450) rank = "Muy Fuerte";
    else if (totalStats > 300) rank = "Competitivo";

    return (
      <div className="text-sm text-yellow-900">
        <p>Este Pokémon tiene una base total de <strong>{totalStats}</strong> puntos.</p>
        <p className="mt-1">Rango estimado: <span className="font-bold underline">{rank}</span></p>
      </div>
    );
  })()}
</div>

        </div>
      </div>
    </div>
  );
}