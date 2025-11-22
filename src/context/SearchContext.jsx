import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollection, setSelectedCollection] = useState(null);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCollection(null);
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            selectedCollection,
            setSelectedCollection,
            clearFilters
        }}>
            {children}
        </SearchContext.Provider>
    );
};
