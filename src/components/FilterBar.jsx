import React from 'react';

function FilterBar() {
    const genres = ['All', 'Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Dark'];

    return (
        <div style={{ marginBottom: '2rem', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {genres.map((genre, index) => (
                    <button
                        key={genre}
                        className={index === 0 ? 'active' : ''}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: index === 0 ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            color: index === 0 ? '#000' : '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.3s',
                            fontWeight: index === 0 ? 'bold' : 'normal'
                        }}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <style>{`
        button:hover {
          background: var(--primary-color);
          color: #000;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        div {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
        </div>
    );
}

export default FilterBar;
