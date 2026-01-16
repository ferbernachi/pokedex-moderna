import React from 'react';

// ACEPTAMOS NUEVAS PROPS: selectedGen y selectedType
export default function SearchBar({ onSearch, onGenerationChange, onTypeChange, selectedGen, selectedType }) {
  
  const generations = [
    { name: 'Todas las Gen', value: 'all' },
    { name: 'Gen 1 - Kanto', value: '1-151' },
    { name: 'Gen 2 - Johto', value: '152-251' },
    { name: 'Gen 3 - Hoenn', value: '252-386' },
    { name: 'Gen 4 - Sinnoh', value: '387-493' },
    { name: 'Gen 5 - Unova', value: '494-649' },
    { name: 'Gen 6 - Kalos', value: '650-721' },
    { name: 'Gen 7 - Alola', value: '722-809' },
    { name: 'Gen 8 - Galar', value: '810-905' },
    { name: 'Gen 9 - Paldea', value: '906-1010' },
  ];

  const types = [
    { name: 'Todos los Tipos', value: 'all' },
    { name: '🔥 Fuego', value: 'fire' },
    { name: '💧 Agua', value: 'water' },
    { name: '🌿 Planta', value: 'grass' },
    { name: '⚡ Eléctrico', value: 'electric' },
    { name: '❄️ Hielo', value: 'ice' },
    { name: '👊 Lucha', value: 'fighting' },
    { name: '☠️ Veneno', value: 'poison' },
    { name: '🏜️ Tierra', value: 'ground' },
    { name: '🦅 Volador', value: 'flying' },
    { name: '🧠 Psíquico', value: 'psychic' },
    { name: '🐞 Bicho', value: 'bug' },
    { name: '🪨 Roca', value: 'rock' },
    { name: '👻 Fantasma', value: 'ghost' },
    { name: '🐉 Dragón', value: 'dragon' },
    { name: '🌑 Siniestro', value: 'dark' },
    { name: '⚙️ Acero', value: 'steel' },
    { name: '🧚 Hada', value: 'fairy' },
    { name: '⚪ Normal', value: 'normal' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto items-center">
      
      {/* 1. INPUT DE TEXTO */}
      <div className="relative flex-1 w-full">
        <input 
          type="text" 
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre..." 
          className="w-full p-4 pl-12 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm font-bold text-slate-700"
        />
        <svg className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        
        {/* 2. SELECTOR DE GENERACIÓN (CONTROLADO) */}
        <div className="relative flex-1 md:w-48">
          <select 
            value={selectedGen} // AQUI ESTÁ LA MAGIA: Forzamos el valor visual
            onChange={(e) => onGenerationChange(e.target.value)}
            className="w-full p-4 pl-4 pr-8 rounded-full border-2 border-slate-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none appearance-none cursor-pointer font-bold text-slate-600 text-sm shadow-sm"
          >
            {generations.map(gen => (
              <option key={gen.name} value={gen.value}>{gen.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
        </div>

        {/* 3. SELECTOR DE TIPO (CONTROLADO) */}
        <div className="relative flex-1 md:w-48">
          <select 
            value={selectedType} // FORZAMOS EL VALOR
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full p-4 pl-4 pr-8 rounded-full border-2 border-slate-200 bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none appearance-none cursor-pointer font-bold text-slate-600 text-sm shadow-sm"
          >
            {types.map(type => (
              <option key={type.name} value={type.value}>{type.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
        </div>

      </div>
    </div>
  );
}