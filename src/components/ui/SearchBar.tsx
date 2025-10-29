'use client';

import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  showFilter?: boolean;
  suggestions?: string[];
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onFilter,
  showFilter = false,
  suggestions = [],
  className = ""
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, isFocused]);

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full pl-10 ${value ? 'pr-20' : 'pr-4'} py-3 bg-primary-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all duration-300 ${
            isFocused ? 'ring-2 ring-neon-cyan/20' : ''
          }`}
        />
        
        {/* Clear button */}
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}

        {/* Filter button */}
        {showFilter && (
          <button
            onClick={onFilter}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
          >
            <Filter className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search suggestions */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-primary-secondary border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 text-white hover:bg-primary-dark transition-colors border-b border-gray-700 last:border-b-0"
            >
              <Search className="h-4 w-4 inline mr-2 text-gray-400" />
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// Advanced search component with filters
interface AdvancedSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
  }[];
  suggestions?: string[];
  placeholder?: string;
  showResults?: boolean;
  resultCount?: number;
  totalCount?: number;
}

export function AdvancedSearch({
  searchValue,
  onSearchChange,
  filters,
  suggestions = [],
  placeholder = "Search...",
  showResults = false,
  resultCount = 0,
  totalCount = 0
}: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <SearchBar
        placeholder={placeholder}
        value={searchValue}
        onChange={onSearchChange}
        onFilter={() => setShowFilters(!showFilters)}
        showFilter={filters.length > 0}
        suggestions={suggestions}
        className="flex-1"
      />

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-4 p-4 bg-primary-secondary/30 rounded-lg border border-gray-600"
        >
          {filters.map((filter, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1">{filter.label}</label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 bg-primary-secondary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-primary-secondary text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </motion.div>
      )}

      {/* Results count */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400"
        >
          Showing {resultCount} of {totalCount} results
          {searchValue && (
            <span> for "<span className="text-white">{searchValue}</span>"</span>
          )}
        </motion.div>
      )}
    </div>
  );
}