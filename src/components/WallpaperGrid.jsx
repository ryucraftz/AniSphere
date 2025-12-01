import React, { useState, useEffect, useMemo } from 'react';
import WallpaperCard from './WallpaperCard';
import FilterBar from './FilterBar';
import DetailModal from './DetailModal';
import { useSearch } from '../context/SearchContext';
import { X } from 'lucide-react';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

function WallpaperGrid() {
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [wallpapers, setWallpapers] = useState([]);
    const [visibleWallpapers, setVisibleWallpapers] = useState([]);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery, selectedCollection, clearFilters } = useSearch();

    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                const response = await fetch('/api/wallpapers');
                const data = await response.json();
                setWallpapers(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Filter wallpapers based on search query and collection
    const filteredWallpapers = useMemo(() => {
        let filtered = wallpapers;

        // Filter by collection
        if (selectedCollection) {
            const collectionKeywords = {
                1: [
                    'one piece', 'kaizoku', 'nakama', 'grand line', 'new world', 'yonko',
                    'devil fruit', 'akuma no mi', 'paramecia', 'zoan', 'logia', 'haki',
                    'kenbunshoku', 'busoshoku', 'haoshoku', 'fish-man', 'gyojin', 'merfolk',
                    'luffy', 'zoro', 'nami', 'usopp', 'sanji', 'chopper', 'robin', 'franky',
                    'brook', 'jimbei', 'jinbe', 'thousand sunny', 'going merry', 'shanks',
                    'whitebeard', 'blackbeard', 'roger', 'ace', 'sabo', 'dressrosa', 'wano',
                    'marineford', 'alabasta', 'skypiea', 'sabaody', 'elbaf', 'mariejois',
                    'enies lobby', 'thriller bark', 'impel down', 'law', 'eustass', 'doflamingo',
                    'buggy', 'akainu', 'kizaru', 'aokiji', 'garp', 'sengoku', 'mihawk',
                    'boa hancock', 'crocodile', 'moria', 'cipher pol', 'reverie', 'poneglyph'
                ],
                2: [
                    'wuthering waves', 'rover', 'jiyan', 'chixia', 'yinlin', 'lingyang',
                    'jianxin', 'taoqi', 'sanhua', 'yuanwu', 'danjin', 'mortefi', 'verina',
                    'zhezhi', 'calcharo', 'encore', 'baizhi', 'yangyang', 'aalto', 'jinhsi',
                    'carlotta', 'camellya', 'xiangli yao', 'roccia', 'chisa', 'buling',
                    'resonators', 'lament', 'echo', 'tacet discord', 'threnodian',
                    'forte circuit', 'resonance skill', 'resonance liberation', 'intro skill',
                    'outro skill', 'aero', 'glacio', 'electro', 'fusion', 'havoc', 'spectro',
                    'astrites', 'lustrous tides', 'radiant tides', 'waveplate', 'union level',
                    'sol-3', 'tacetite', 'jinzhou', 'huanglong', 'tacet field', 'pangu terminal',
                    'shell credits', 'tower of adversity', 'tactical hologram', 'resonance chain'
                ]
            };

            const keywords = collectionKeywords[selectedCollection.id] || [];
            filtered = filtered.filter(wp => {
                const title = wp.title?.toLowerCase() || '';
                const id = wp.id?.toLowerCase() || '';
                return keywords.some(keyword => title.includes(keyword) || id.includes(keyword));
            });
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(wp => {
                const titleMatch = wp.title?.toLowerCase().includes(query);
                const filenameMatch = wp.id?.toLowerCase().includes(query);
                return titleMatch || filenameMatch;
            });
        }

        return filtered;
    }, [wallpapers, searchQuery, selectedCollection]);

    // Reset visible wallpapers when filters change
    useEffect(() => {
        setPage(1);
        setVisibleWallpapers(filteredWallpapers.slice(0, ITEMS_PER_PAGE));
    }, [filteredWallpapers]);

    // Load more wallpapers
    const loadMore = () => {
        if (visibleWallpapers.length < filteredWallpapers.length) {
            const nextPage = page + 1;
            const nextItems = filteredWallpapers.slice(0, nextPage * ITEMS_PER_PAGE);
            setVisibleWallpapers(nextItems);
            setPage(nextPage);
        }
    };

    const sentinelRef = useInfiniteScroll(loadMore);

    if (loading) return <div className="container wallpaper-grid-loading">Loading wallpapers...</div>;
    if (error) return <div className="container wallpaper-grid-error">Error: {error}</div>;

    return (
        <section id="trending" className="container wallpaper-grid-section">
            <div className="wallpaper-grid-header">
                <h2 className="neon-text wallpaper-grid-title">
                    {selectedCollection
                        ? `${selectedCollection.title} Collection`
                        : searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : 'Trending Wallpapers'
                    }
                </h2>
                {(selectedCollection || searchQuery) && (
                    <button onClick={clearFilters} className="clear-filter-btn">
                        <X size={16} />
                        Clear Filter
                    </button>
                )}
            </div>

            <FilterBar />

            {visibleWallpapers.length === 0 ? (
                <div className="wallpaper-grid-empty">
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No wallpapers found</p>
                    <p>Try a different search term or collection</p>
                </div>
            ) : (
                <>
                    <div className="wallpaper-grid">
                        {visibleWallpapers.map(wp => (
                            <WallpaperCard key={wp.id} wallpaper={wp} onClick={setSelectedWallpaper} />
                        ))}
                    </div>
                    {visibleWallpapers.length < filteredWallpapers.length && (
                        <div ref={sentinelRef} className="infinite-scroll-sentinel">
                            Loading more...
                        </div>
                    )}
                </>
            )}

            <DetailModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />
        </section>
    );
}

export default WallpaperGrid;
