import React, { useState } from 'react';

interface SearchBarProps {
  onChange: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para lidar com a pesquisa
    console.log('Searching for:', searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onChange(value); // Chama a função onChange com o valor atual
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar..."
        className="border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded-r-md p-2 hover:bg-indigo-600 transition duration-200"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;