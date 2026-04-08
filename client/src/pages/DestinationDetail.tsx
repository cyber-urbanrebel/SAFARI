import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationsApi } from '../api/destinations';
import { bookingsApi } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import type { Destination } from '../types';
import './DestinationDetail.css';

const categoryEmoji: Record<string, string> = {
  SAFARI: '🦁',
  BEACH: '🏖️',
  MOUNTAIN: '⛰️',
  CULTURAL: '🏛️',
  WILDLIFE: '🐘',
  ADVENTURE: '🧗',
};

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (!id) return;
    destinationsApi
      .getById(id)
      .then(setDestination)
      .catch(() => setError('Destination not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBooking(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await bookingsApi.create({
        destinationId: id!,
        startDate,
        endDate,
        guests,
        notes,
      });

      const nights = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const total = destination!.price * guests * nights;

      setBookingSuccess(`🎉 Booking confirmed! Total: $${total.toFixed(2)}`);
      setStartDate('');
      setEndDate('');
      setGuests(1);
      setNotes('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setBookingError(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !destination) return null;
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (nights <= 0) return null;
    return destination.price * guests * nights;
  };

  const totalPrice = calculateTotal();
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!destination) return null;

  return (
    <div className="detail-page">
      <div className="detail-hero">
        <img src={destination.imageUrl} alt={destination.name} />
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <div className="detail-breadcrumb">
              <Link to="/destinations">Destinations</Link> &rsaquo; {destination.name}
            </div>
            <span className="detail-category">
              {categoryEmoji[destination.category]} {destination.category}
            </span>
            <h1>{destination.name}</h1>
            <p className="detail-location">📍 {destination.location}</p>
            <div className="detail-rating">
              ⭐ {destination.rating.toFixed(1)} ({destination.reviewCount.toLocaleString()} reviews)
            </div>
          </div>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          <div className="detail-info">
            <h2>About This Destination</h2>
            <p>{destination.description}</p>

            <div className="detail-highlights">
              <div className="highlight-card">
                <span>📍</span>
                <div>
                  <strong>Location</strong>
                  <span>{destination.location}</span>
                </div>
              </div>
              <div className="highlight-card">
                <span>🏷️</span>
                <div>
                  <strong>Category</strong>
                  <span>{destination.category}</span>
                </div>
              </div>
              <div className="highlight-card">
                <span>⭐</span>
                <div>
                  <strong>Rating</strong>
                  <span>{destination.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>
              <div className="highlight-card">
                <span>💰</span>
                <div>
                  <strong>Price</strong>
                  <span>${destination.price}/person/night</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="booking-card">
            <div className="booking-card-header">
              <div className="booking-price">
                <span className="booking-price-amount">${destination.price}</span>
                <span className="booking-price-unit">per person/night</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBook}>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  value={guests}
                  min={1}
                  max={20}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Special Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements..."
                  rows={3}
                />
              </div>

              {totalPrice !== null && (
                <div className="booking-total">
                  <span>Estimated Total</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              )}

              {bookingSuccess && (
                <div className="booking-success">{bookingSuccess}</div>
              )}
              {bookingError && (
                <div className="booking-error">{bookingError}</div>
              )}

              <button
                type="submit"
                className="booking-submit"
                disabled={booking}
              >
                {booking ? 'Booking...' : isAuthenticated ? 'Book Now' : 'Login to Book'}
              </button>

              {!isAuthenticated && (
                <p className="booking-login-hint">
                  <Link to="/login">Login</Link> or{' '}
                  <Link to="/register">create an account</Link> to book this adventure.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
