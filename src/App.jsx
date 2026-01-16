import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';
import SearchBar from './components/SearchBar';
import TeamDock from './components/TeamDock';
import AlertModal from './components/AlertModal'; // <--- 1. IMPORTAMOS LA ALERTA
import ChatBot from './components/ChatBot';

function App() {
  const [allPokemonsIndex, setAllPokemonsIndex] = useState([]); 
  const [displayedPokemons, setDisplayedPokemons] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // ESTADO PARA LA ALERTA
  const [showAlert, setShowAlert] = useState(false); // <--- 2. NUEVO ESTADO

  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('myPokemonTeam');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myPokemonTeam', JSON.stringify(team));
  }, [team]);

  // --- LÓGICA MODIFICADA ---
  const handleToggleTeam = (pokemon) => {
    const isMember = team.some(p => p.id === pokemon.id);

    if (isMember) {
      setTeam(team.filter(p => p.id !== pokemon.id));
    } else {
      if (team.length < 6) {
        setTeam([...team, pokemon]);
      } else {
        // AQUÍ ESTÁ EL CAMBIO: En vez de alert(), activamos nuestro modal
        setShowAlert(true); 
      }
    }
  };
  // -------------------------

  const handleRemoveFromDock = (pokemonId) => {
    setTeam(team.filter(p => p.id !== pokemonId));
  };

  useEffect(() => {
    const fetchGlobalIndex = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
        const data = await res.json();
        setAllPokemonsIndex(data.results);
        fetchDetailedData(data.results.slice(0, 20), true);
      } catch (error) {
        console.error("Error cargando índice global:", error);
      }
    };
    fetchGlobalIndex();
  }, []);

  const fetchDetailedData = async (pokemonList, shouldReplace = false) => {
    setLoading(true);
    try {
      const details = await Promise.all(
        pokemonList.map(async (p) => {
          const res = await fetch(p.url);
          return res.json();
        })
      );
      if (shouldReplace) {
        setDisplayedPokemons(details);
      } else {
        setDisplayedPokemons(prev => [...prev, ...details]);
      }
    } catch (error) {
      console.error("Error cargando detalles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allPokemonsIndex.length === 0) return;
    const delaySearch = setTimeout(() => {
      if (searchTerm === '') {
        if (offset === 0 && displayedPokemons.length !== 20) {
             fetchDetailedData(allPokemonsIndex.slice(0, 20), true);
        }
      } else {
        const filteredResults = allPokemonsIndex.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        fetchDetailedData(filteredResults.slice(0, 20), true);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, allPokemonsIndex]);

  const handleLoadMore = () => {
    if (searchTerm !== '') return;
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchDetailedData(allPokemonsIndex.slice(newOffset, newOffset + 20), false);
  };

  const resetToHome = () => {
    setSearchTerm(''); 
    setOffset(0);     
    if (allPokemonsIndex.length > 0) {
      fetchDetailedData(allPokemonsIndex.slice(0, 20), true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 pl-32"> 
      <div className="max-w-7xl mx-auto">
        
        <div onClick={resetToHome} className="text-center mb-10 cursor-pointer group select-none">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
            Pokédex Wish
          </h1>
          <p className="text-gray-500 font-medium group-hover:text-blue-500 transition-colors">
            Versión Web Moderna - Haz clic para Inicio
          </p>
        </div>

        <SearchBar onSearch={setSearchTerm} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPokemons.map((pokemon) => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon} 
              onClick={setSelectedPokemon} 
            />
          ))}
        </div>

        <div className="text-center mt-12 mb-8">
          {loading && (
            <p className="text-xl font-bold text-blue-600 animate-pulse">Cargando datos...</p>
          )}
          
          {!loading && displayedPokemons.length === 0 && (
            <p className="text-xl text-gray-500">No se encontraron Pokémon con ese nombre.</p>
          )}

          {!loading && searchTerm === '' && displayedPokemons.length > 0 && (
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-xl hover:bg-slate-700 hover:scale-105 transition-all transform"
            >
              Cargar Más Pokémon
            </button>
          )}
        </div>

        {/* DOCK LATERAL */}
        <TeamDock team={team} onRemove={handleRemoveFromDock} />

        {/* COMPONENTE DE ALERTA (Se renderiza siempre, pero solo se ve si isOpen={true}) */}
        <AlertModal 
          isOpen={showAlert} 
          onClose={() => setShowAlert(false)} 
          title="¡Equipo Completo!"
          message="Solo puedes llevar 6 Pokémon en tu equipo. Libera uno antes de añadir otro."
        />

        {/* MODAL DETALLE */}
        {selectedPokemon && (
          <PokemonModal 
            pokemon={selectedPokemon} 
            onClose={() => setSelectedPokemon(null)}
            isTeamMember={team.some(p => p.id === selectedPokemon.id)}
            onToggleTeam={handleToggleTeam}
          />
        )}
        
        <ChatBot />

      </div>
    </div>
  );
}

export default App;