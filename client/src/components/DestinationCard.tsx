import React from 'react';
import { Link } from 'react-router-dom';
import type { Destination } from '../types';
import './DestinationCard.css';

interface Props {
  destination: Destination;
}

const categoryEmoji: Record<string, string> = {
  SAFARI: '🦁',
  BEACH: '🏖️',
  MOUNTAIN: '⛰️',
  CULTURAL: '🏛️',
  WILDLIFE: '🐘',
  ADVENTURE: '🧗',
};

const DestinationCard: React.FC<Props> = ({ destination }) => {
  return (
    <div className="dest-card">
      <div className="dest-card-image">
        <img src={destination.imageUrl} alt={destination.name} loading="lazy" />
        {destination.featured && <span className="dest-badge">Featured</span>}
        <span className="dest-category">
          {categoryEmoji[destination.category]} {destination.category}
        </span>
      </div>
      <div className="dest-card-content">
        <h3>{destination.name}</h3>
        <p className="dest-location">📍 {destination.location}</p>
        <p className="dest-description">{destination.description.substring(0, 120)}...</p>
        <div className="dest-footer">
          <div className="dest-rating">
            ⭐ {destination.rating.toFixed(1)}
            <span className="dest-reviews">({destination.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <div className="dest-price">
            <span className="dest-price-amount">${destination.price}</span>
            <span className="dest-price-unit">/person/night</span>
          </div>
        </div>
        <Link to={`/destinations/${destination.id}`} className="dest-cta">
          Explore →
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
