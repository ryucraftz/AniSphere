import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const localData = localStorage.getItem('favorites');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    const addToFavorites = (wallpaper) => {
        setFavorites((prev) => {
            if (prev.some((item) => item.id === wallpaper.id)) return prev;
            return [...prev, wallpaper];
        });
    };

    const removeFromFavorites = (wallpaperId) => {
        setFavorites((prev) => prev.filter((item) => item.id !== wallpaperId));
    };

    const isFavorite = (wallpaperId) => {
        return favorites.some((item) => item.id === wallpaperId);
    };

    const toggleFavorite = (wallpaper) => {
        if (isFavorite(wallpaper.id)) {
            removeFromFavorites(wallpaper.id);
        } else {
            addToFavorites(wallpaper);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
