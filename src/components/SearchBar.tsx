import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.toUpperCase();
    setQuery(newQuery);
    onSearch(newQuery);
  };
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className="bg-white p-4 w-full flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar..."
        className="w-full border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleClear}
        className="bg-red-500 text-white rounded-r-md p-2 hover:bg-red-600 transition duration-200"
      >
        &times;
      </button>
    </div>
  );
};

export default SearchBar;