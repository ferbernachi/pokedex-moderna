import React from 'react';

const typeColors = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-300',
  normal: 'bg-gray-400',
  fighting: 'bg-orange-700',
  flying: 'bg-sky-400',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  rock: 'bg-stone-500',
  bug: 'bg-lime-500',
  ghost: 'bg-indigo-900',
  steel: 'bg-slate-400',
};

export default function PokemonCard({ pokemon, onClick }) {
  const mainType = pokemon.types[0].type.name;
  const colorClass = typeColors[mainType] || 'bg-gray-500';

  return (
    <div 
      onClick={() => onClick(pokemon)}
      className={`relative p-4 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ${colorClass} bg-opacity-80 backdrop-blur-sm text-white`}
    >
      <div className="absolute top-2 right-2 text-xs font-bold opacity-70">
        #{pokemon.id.toString().padStart(3, '0')}
      </div>
      
      <div className="flex flex-col items-center">
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
          alt={pokemon.name}
          className="w-32 h-32 drop-shadow-md z-10"
        />
        <h2 className="text-xl font-bold capitalize mt-2">{pokemon.name}</h2>
        
        <div className="flex gap-2 mt-2">
          {pokemon.types.map((t) => (
            <span key={t.type.name} className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full capitalize">
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}