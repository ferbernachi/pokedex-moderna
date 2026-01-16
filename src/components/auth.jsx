import React, { useState, useEffect } from 'react';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [animateMascot, setAnimateMascot] = useState(false);

  useEffect(() => {
    setFeedback({ type: '', text: '' });
    setName('');
    setAnimateMascot(true);
    const timer = setTimeout(() => setAnimateMascot(false), 500);
    return () => clearTimeout(timer);
  }, [isRegister]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setFeedback({ type: 'error', text: 'Mínimo 3 caracteres para tu ID.' });
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('pokedex_registered_users') || '[]');
    if (existingUsers.includes(name.trim())) {
      setFeedback({ type: 'error', text: '¡Ese Entrenador ya existe!' });
      return;
    }

    const updatedUsers = [...existingUsers, name.trim()];
    localStorage.setItem('pokedex_registered_users', JSON.stringify(updatedUsers));

    setFeedback({ type: 'success', text: '¡Cuenta creada con éxito!' });
    setTimeout(() => {
        setIsRegister(false);
        setFeedback({ type: 'success', text: 'Ahora accede con tu nuevo ID.' });
        setName('');
    }, 1500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('pokedex_registered_users') || '[]');
    if (existingUsers.includes(name.trim())) {
      onLogin(name.trim());
    } else {
      setFeedback({ type: 'error', text: 'Entrenador no encontrado.' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      
      {/* FONDO ANIMADO */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 animate-gradient-xy"></div>
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-4xl h-[600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex overflow-hidden flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: ARTE */}
        <div className={`md:w-1/2 relative flex items-center justify-center p-8 transition-colors duration-500 ${isRegister ? 'bg-blue-600/20' : 'bg-red-600/20'}`}>
           <div className="absolute opacity-10 w-[120%] h-[120%] animate-spin-slow">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white w-full h-full">
                 <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="none"/>
                 <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="10"/>
                 <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="10" fill="none"/>
              </svg>
           </div>
           
           <img 
             src={isRegister 
               ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" 
               : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
             }
             className={`w-64 h-64 object-contain drop-shadow-2xl z-10 transition-transform duration-500 ${animateMascot ? 'scale-90 opacity-80' : 'scale-110 opacity-100'}`}
             alt="Mascota"
           />
           
           <div className="absolute bottom-8 text-white/80 font-bold tracking-widest text-xs uppercase">
              {isRegister ? 'Únete a la Liga' : 'Bienvenido de nuevo'}
           </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 md:bg-white/50 backdrop-blur-md">
          
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-800 mb-1 tracking-tight">
              {isRegister ? 'Registro' : 'Hola!'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isRegister ? 'Crea tu ID de Entrenador oficial.' : 'Introduce tus credenciales para acceder.'}
            </p>
          </div>

          <form onSubmit={isRegister ? handleRegister : handleLoginSubmit} className="space-y-6">
            
            {/* INPUT FIJO (SIN SOLAPAMIENTOS) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">
                Nombre de Entrenador
              </label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-white/60 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-800 placeholder-slate-400"
                placeholder="Ej: Ash Ketchum"
              />
            </div>

            {/* Feedback Message */}
            {feedback.text && (
              <div className={`text-xs font-bold p-3 rounded-lg flex items-center gap-2 animate-bounce ${
                feedback.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                <span>{feedback.type === 'error' ? '⚠️' : '✅'}</span>
                {feedback.text}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-4 rounded-xl font-black text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
                isRegister 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/30' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-red-500/30'
              }`}
            >
              {isRegister ? 'CREAR PERFIL' : 'INICIAR AVENTURA'}
              <span>➔</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              {isRegister ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?'}
            </p>
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm font-black text-slate-800 hover:text-blue-600 underline decoration-2 underline-offset-4 transition-colors mt-1"
            >
              {isRegister ? 'Inicia Sesión' : 'Regístrate Gratis'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}