import React from 'react';

export default function SearchBar({ onSearch }) {
  const handleChange = (e) => {
    onSearch(e.target.value.toLowerCase());
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          onChange={handleChange}
          className="w-full p-4 pl-12 rounded-full border-none shadow-lg bg-white bg-opacity-90 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
        />
        <svg 
          className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}