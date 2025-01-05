"use client";

import { useCallback, useState } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import debounce from 'lodash/debounce';

interface SearchEventProps {
  onSearch: (query: string) => void;
}

export default function SearchEvent({ onSearch }: SearchEventProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search events..."
        className="w-full px-6 py-3 text-white bg-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 shadow-lg transition duration-300 ease-in-out">
        <BiSearchAlt />
      </button>
    </div>
  );
}