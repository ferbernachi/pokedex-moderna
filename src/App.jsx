import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';
import SearchBar from './components/SearchBar';
import TeamDock from './components/TeamDock';
import AlertModal from './components/AlertModal';
import Auth from './components/Auth';
import ChatBot from './components/ChatBot';
import CompareModal from './components/CompareModal';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('pokeUser'));
  
  // DATOS
  const [allPokemonsIndex, setAllPokemonsIndex] = useState([]); // Índice maestro (10k pokemon)
  const [filteredIndex, setFilteredIndex] = useState([]); // Índice filtrado (lo que ve el usuario)
  const [displayedPokemons, setDisplayedPokemons] = useState([]); // Los 20 que se renderizan
  
  // FILTROS
  const [currentGenRange, setCurrentGenRange] = useState('all');
  const [currentType, setCurrentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI
  const [offset, setOffset] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // EQUIPO Y COMPARACIÓN
  const [team, setTeam] = useState([]); 
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);

  // --- LÓGICA DE USUARIO Y EQUIPO ---
  useEffect(() => {
    if (user) {
      const userTeam = localStorage.getItem(`team_${user}`);
      setTeam(userTeam ? JSON.parse(userTeam) : []);
    }
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`team_${user}`, JSON.stringify(team));
  }, [team, user]);

  const handleLogin = (name) => {
    localStorage.setItem('pokeUser', name);
    setUser(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('pokeUser');
    setUser(null);
  };

  const handleToggleTeam = (pokemon) => {
    const isMember = team.some(p => p.id === pokemon.id);
    if (isMember) {
      setTeam(team.filter(p => p.id !== pokemon.id));
    } else {
      if (team.length < 6) setTeam([...team, pokemon]);
      else setShowAlert(true); 
    }
  };

  const handleRemoveFromDock = (id) => setTeam(team.filter(p => p.id !== id));

  const handleCardClick = (pokemon) => {
    if (isCompareMode) {
      const isSelected = compareSelection.some(p => p.id === pokemon.id);
      if (isSelected) setCompareSelection(prev => prev.filter(p => p.id !== pokemon.id));
      else if (compareSelection.length < 2) setCompareSelection(prev => [...prev, pokemon]);
      else setCompareSelection([compareSelection[0], pokemon]); 
    } else {
      setSelectedPokemon(pokemon);
    }
  };

  // --- CARGA INICIAL ---
  useEffect(() => {
    const fetchGlobalIndex = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0');
        const data = await res.json();
        setAllPokemonsIndex(data.results);
        setFilteredIndex(data.results);
        fetchDetailedData(data.results.slice(0, 20), true);
      } catch (error) {
        console.error("Error índice:", error);
      }
    };
    fetchGlobalIndex();
  }, []);

  // --- MOTOR DE FILTRADO MAESTRO (INGENIERÍA) ---
  const applyFilters = async (genRange, type) => {
    setLoading(true);
    setSearchTerm('');
    setOffset(0);

    let baseList = [];

    try {
      // 1. FILTRO DE TIPO (¿Qué lista base usamos?)
      if (type === 'all') {
        baseList = allPokemonsIndex;
      } else {
        // Fetch específico al endpoint de tipos
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await res.json();
        // Normalizamos la estructura de datos porque la API de tipos devuelve { pokemon: { name, url } }
        baseList = data.pokemon.map(p => p.pokemon);
      }

      // 2. FILTRO DE GENERACIÓN (Intersección por ID)
      if (genRange !== 'all') {
        const [start, end] = genRange.split('-').map(Number);
        
        baseList = baseList.filter(p => {
          // Extraer ID de la URL: "https://pokeapi.co/api/v2/pokemon/25/"
          const parts = p.url.split('/');
          const id = parseInt(parts[parts.length - 2]);
          return id >= start && id <= end;
        });
      }

      // 3. ACTUALIZAMOS ESTADO
      setFilteredIndex(baseList);
      
      if (baseList.length > 0) {
        await fetchDetailedData(baseList.slice(0, 20), true);
      } else {
        setDisplayedPokemons([]);
        setLoading(false);
      }

    } catch (error) {
      console.error("Error filtrando:", error);
      setLoading(false);
    }
  };

  // Handlers para los selectores
  const handleGenerationChange = (range) => {
    setCurrentGenRange(range);
    applyFilters(range, currentType); // Usamos el tipo actual
  };

  const handleTypeChange = (type) => {
    setCurrentType(type);
    applyFilters(currentGenRange, type); // Usamos la gen actual
  };

  // --- BÚSQUEDA Y PAGINACIÓN ---
  useEffect(() => {
    if (allPokemonsIndex.length === 0) return;
    const delaySearch = setTimeout(() => {
      if (searchTerm === '') {
        if (offset === 0 && filteredIndex.length > 0) {
           // Si borra la búsqueda, restauramos la vista actual del filtro
           // No hacemos fetch si ya tenemos los datos cargados en displayedPokemons
        }
      } else {
        const searchResults = filteredIndex.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        fetchDetailedData(searchResults.slice(0, 20), true);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const fetchDetailedData = async (pokemonList, shouldReplace = false) => {
    setLoading(true);
    try {
      const details = await Promise.all(
        pokemonList.map(async (p) => {
          const res = await fetch(p.url);
          return res.json();
        })
      );
      if (shouldReplace) setDisplayedPokemons(details);
      else setDisplayedPokemons(prev => [...prev, ...details]);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleLoadMore = () => {
    if (searchTerm !== '') return;
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchDetailedData(filteredIndex.slice(newOffset, newOffset + 20), false);
  };

  const resetToHome = () => {
    setSearchTerm('');
    setOffset(0);
    setCurrentGenRange('all');
    setCurrentType('all');
    setFilteredIndex(allPokemonsIndex);
    fetchDetailedData(allPokemonsIndex.slice(0, 20), true);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 pl-32">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER Y LOGOUT */}
        <div className="absolute top-4 right-4 z-40">
           <button onClick={handleLogout} className="bg-white px-4 py-2 rounded-full text-xs font-bold text-red-500 shadow-md hover:bg-red-50">
             SALIR ({user})
           </button>
        </div>

        <div onClick={resetToHome} className="text-center mb-10 cursor-pointer group select-none">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 drop-shadow-sm">
            Pokédex Wish
          </h1>
          <p className="text-gray-500 font-medium italic">
            Entrenador: <span className="text-blue-600 font-bold">{user}</span>
          </p>
        </div>

        {/* SEARCHBAR CON NUEVOS PROPS */}
{/* SEARCHBAR CON CONTROL TOTAL DE ESTADO */}
<SearchBar 
  onSearch={setSearchTerm} 
  onGenerationChange={handleGenerationChange} 
  onTypeChange={handleTypeChange}
  // Pasamos los valores actuales para que los selects se actualicen visualmente
  selectedGen={currentGenRange}
  selectedType={currentType}
/>

        {/* GRID DE POKÉMON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPokemons.map((pokemon) => {
            const isSelected = compareSelection.some(p => p.id === pokemon.id);
            return (
              <div key={pokemon.id} className={`relative transition-all duration-300 ${
                  isCompareMode && isSelected ? 'ring-4 ring-yellow-400 scale-105 z-10 rounded-3xl' : ''
              } ${isCompareMode && !isSelected ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                  <PokemonCard pokemon={pokemon} onClick={() => handleCardClick(pokemon)} />
                  {isCompareMode && (
                      <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                          isSelected ? 'bg-yellow-400 text-white' : 'bg-gray-200'
                      }`}>{isSelected && '✓'}</div>
                  )}
              </div>
            );
          })}
        </div>

        {/* ESTADO VACÍO Y CARGAR MÁS */}
        <div className="text-center mt-12 mb-8">
          {loading && <p className="text-xl font-bold text-blue-600 animate-pulse">Cargando datos...</p>}
          
          {!loading && displayedPokemons.length === 0 && (
            <div className="p-8 bg-white rounded-2xl shadow-sm inline-block">
              <p className="text-xl text-gray-500">No hay Pokémon que coincidan con este filtro.</p>
              <button onClick={resetToHome} className="mt-4 text-blue-600 font-bold underline">Limpiar filtros</button>
            </div>
          )}

          {!loading && searchTerm === '' && displayedPokemons.length < filteredIndex.length && (
            <button onClick={handleLoadMore} className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-xl hover:bg-slate-700 hover:scale-105 transition-all">
              Cargar Más
            </button>
          )}
        </div>

        <TeamDock team={team} onRemove={handleRemoveFromDock} />
        
        <AlertModal isOpen={showAlert} onClose={() => setShowAlert(false)} title="¡Equipo Completo!" message="Solo puedes llevar 6 Pokémon." />

        {selectedPokemon && (
          <PokemonModal 
            pokemon={selectedPokemon} 
            onClose={() => setSelectedPokemon(null)}
            isTeamMember={team.some(p => p.id === selectedPokemon.id)}
            onToggleTeam={handleToggleTeam}
          />
        )}

        {isCompareMode && compareSelection.length === 2 && (
            <CompareModal pokemon1={compareSelection[0]} pokemon2={compareSelection[1]} onClose={() => setCompareSelection([])} />
        )}

        {/* BOTÓN COMPARAR */}
        <div className="fixed bottom-28 right-6 z-[100]">
          <button 
            onClick={() => { setIsCompareMode(!isCompareMode); setCompareSelection([]); }}
            className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all border-4 border-white ${
                isCompareMode ? 'bg-yellow-400 text-yellow-900 rotate-180' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isCompareMode ? '✕' : '⚖️'} 
          </button>
          {isCompareMode && compareSelection.length === 2 && (
             <button className="absolute bottom-16 right-0 bg-green-600 text-white font-bold px-4 py-2 rounded-full shadow-xl animate-bounce whitespace-nowrap">
                ¡COMPARAR!
             </button>
          )}
        </div>

        <ChatBot />
      </div>
    </div>
  );
}

export default App;