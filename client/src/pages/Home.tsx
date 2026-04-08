import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationsApi } from '../api/destinations';
import type { Destination } from '../types';
import DestinationCard from '../components/DestinationCard';
import './Home.css';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    destinationsApi
      .getAll({ featured: true, limit: 6 })
      .then((data) => setFeatured(data.destinations))
      .catch(() => setError('Failed to load destinations'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-tag">Discover Kenya</span>
            <h1>
              Experience the Wild Heart<br />
              of <span className="hero-highlight">Africa</span>
            </h1>
            <p>
              From the iconic Maasai Mara migration to the pristine shores of Diani Beach —
              explore Kenya's most breathtaking destinations and book your adventure today.
            </p>
            <div className="hero-ctas">
              <Link to="/destinations" className="btn-hero-primary">
                Explore Destinations 🌍
              </Link>
              <Link to="/register" className="btn-hero-outline">
                Start Your Journey
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>10+</strong>
                <span>Destinations</span>
              </div>
              <div className="hero-stat">
                <strong>5,000+</strong>
                <span>Happy Travelers</span>
              </div>
              <div className="hero-stat">
                <strong>4.8★</strong>
                <span>Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Explore by Category</h2>
          <div className="categories-grid">
            {[
              { icon: '🦁', label: 'Safari', value: 'SAFARI' },
              { icon: '🏖️', label: 'Beach', value: 'BEACH' },
              { icon: '⛰️', label: 'Mountain', value: 'MOUNTAIN' },
              { icon: '🐘', label: 'Wildlife', value: 'WILDLIFE' },
              { icon: '🏛️', label: 'Cultural', value: 'CULTURAL' },
              { icon: '🧗', label: 'Adventure', value: 'ADVENTURE' },
            ].map((cat) => (
              <Link
                key={cat.value}
                to={`/destinations?category=${cat.value}`}
                className="category-card"
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Destinations</h2>
            <Link to="/destinations" className="see-all-link">
              See all →
            </Link>
          </div>

          {loading && <p className="loading-text">Loading destinations...</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="destinations-grid">
            {featured.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready for Your Kenyan Adventure?</h2>
          <p>
            Join thousands of travelers who've discovered Kenya's magic. Create your free account
            and start booking today.
          </p>
          <Link to="/register" className="btn-hero-primary">
            Get Started — It's Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
