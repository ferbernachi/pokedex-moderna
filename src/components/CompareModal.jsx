import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function CompareModal({ pokemon1, pokemon2, onClose }) {
  if (!pokemon1 || !pokemon2) return null;

  // 1. Preparamos los datos para el gráfico comparativo
  const statsData = pokemon1.stats.map((s, index) => ({
    subject: s.stat.name.replace('-', ' ').toUpperCase(),
    A: s.base_stat,              // Stats del Pokémon 1
    B: pokemon2.stats[index].base_stat, // Stats del Pokémon 2
    fullMark: 150,
  }));

  const total1 = pokemon1.stats.reduce((acc, s) => acc + s.base_stat, 0);
  const total2 = pokemon2.stats.reduce((acc, s) => acc + s.base_stat, 0);

  // Función para ver quién gana en cada stat
  const getStatColor = (val1, val2) => {
    if (val1 > val2) return 'text-green-600 font-bold';
    if (val1 < val2) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            ⚔️ Análisis de Combate
          </h2>
          <button onClick={onClose} className="hover:bg-slate-700 px-3 py-1 rounded-full transition-colors">✕ Cerrar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* ENCABEZADO VS */}
          <div className="flex justify-between items-center mb-8">
            {/* POKEMON 1 */}
            <div className="text-center w-1/3">
               <img src={pokemon1.sprites.other['official-artwork'].front_default} className="w-24 h-24 mx-auto drop-shadow-md" />
               <h3 className="font-black text-xl capitalize mt-2 text-blue-600">{pokemon1.name}</h3>
               <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Total: {total1}</span>
            </div>

            <div className="text-4xl font-black text-slate-300 italic">VS</div>

            {/* POKEMON 2 */}
            <div className="text-center w-1/3">
               <img src={pokemon2.sprites.other['official-artwork'].front_default} className="w-24 h-24 mx-auto drop-shadow-md" />
               <h3 className="font-black text-xl capitalize mt-2 text-red-600">{pokemon2.name}</h3>
               <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded-full">Total: {total2}</span>
            </div>
          </div>

          {/* GRÁFICO COMPARATIVO */}
          <div className="h-64 w-full bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={statsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  
                  <Radar name={pokemon1.name} dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                  <Radar name={pokemon2.name} dataKey="B" stroke="#dc2626" fill="#dc2626" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
             </ResponsiveContainer>
          </div>

          {/* TABLA DE COMPARACIÓN DETALLADA */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
             <table className="w-full text-sm text-center">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                   <tr>
                      <th className="py-2">{pokemon1.name}</th>
                      <th className="py-2">Estadística</th>
                      <th className="py-2">{pokemon2.name}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {statsData.map((stat, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                         <td className={`py-2 font-mono ${getStatColor(stat.A, stat.B)}`}>{stat.A}</td>
                         <td className="py-2 font-bold text-slate-400 text-xs">{stat.subject}</td>
                         <td className={`py-2 font-mono ${getStatColor(stat.B, stat.A)}`}>{stat.B}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

        </div>
      </div>
    </div>
  );
}