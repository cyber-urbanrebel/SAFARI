import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationsApi } from '../api/destinations';
import type { Destination } from '../types';
import DestinationCard from '../components/DestinationCard';
import './Destinations.css';

const CATEGORIES = ['ALL', 'SAFARI', 'BEACH', 'MOUNTAIN', 'WILDLIFE', 'CULTURAL', 'ADVENTURE'];

const Destinations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const category = searchParams.get('category') || 'ALL';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    destinationsApi
      .getAll({
        category: category !== 'ALL' ? category : undefined,
        search: search || undefined,
        page,
        limit: 9,
      })
      .then((data) => {
        setDestinations(data.destinations);
        setTotalPages(data.pagination.totalPages);
      })
      .catch(() => setError('Failed to load destinations'))
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (searchInput) params.search = searchInput;
    if (category !== 'ALL') params.category = category;
    setSearchParams(params);
  };

  const handleCategory = (cat: string) => {
    const params: Record<string, string> = {};
    if (cat !== 'ALL') params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
  };

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <div className="destinations-header-content">
          <h1>Explore Kenya</h1>
          <p>Discover amazing destinations across Kenya</p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search destinations, locations..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍 Search
            </button>
          </form>
        </div>
      </div>

      <div className="destinations-content">
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat === 'ALL' ? '🌍 All' : cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="loading-spinner">
            <p>Loading destinations...</p>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        {!loading && destinations.length === 0 && (
          <div className="empty-state">
            <p>🔍 No destinations found. Try a different search or category.</p>
          </div>
        )}

        <div className="destinations-grid-page">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() =>
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  p.set('page', String(page - 1));
                  return p;
                })
              }
              className="page-btn"
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() =>
                setSearchParams((prev) => {
                  const p = new URLSearchParams(prev);
                  p.set('page', String(page + 1));
                  return p;
                })
              }
              className="page-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
