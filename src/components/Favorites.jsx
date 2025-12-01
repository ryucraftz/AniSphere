                
                .tab - btn {
    display: flex;
    align - items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    color: var(--text - muted);
    font - size: 1rem;
    font - weight: 600;
    cursor: pointer;
    border - bottom: 2px solid transparent;
    transition: all 0.3s ease;
    white - space: nowrap;
}
                
                .tab - btn:hover {
    color: var(--text - color);
    background: var(--glass - bg);
}
                
                .tab - btn.active {
    color: var(--primary - color);
    border - bottom - color: var(--primary - color);
}
                
                .tab - count {
    background: var(--glass - bg);
    padding: 0.1rem 0.5rem;
    border - radius: 12px;
    font - size: 0.85rem;
    border: 1px solid var(--glass - border);
}
                
                .tab - btn.active.tab - count {
    background: var(--primary - color);
    color: var(--bg - color);
    border - color: var(--primary - color);
}
                
                .wallpaper - grid {
    display: grid;
    grid - template - columns: repeat(auto - fill, minmax(min(100 %, 160px), 1fr));
    gap: 12px;
}

@media(min - width: 768px) {
                    .wallpaper - grid {
        grid - template - columns: repeat(auto - fill, minmax(250px, 1fr));
        gap: 20px;
    }
}
`}</style>
        </section>
    );
}

export default Favorites;
