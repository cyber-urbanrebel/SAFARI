import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import type { Booking } from '../types';
import './Bookings.css';

const statusColor: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#16a34a',
  CANCELLED: '#dc2626',
  COMPLETED: '#3b82f6',
};

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadBookings = () => {
    setLoading(true);
    bookingsApi
      .getMyBookings()
      .then(setBookings)
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      await bookingsApi.updateStatus(id, 'CANCELLED');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (loading) return <div className="bookings-loading">Loading bookings...</div>;

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div className="bookings-header-content">
          <h1>My Bookings</h1>
          <p>Welcome back, {user?.name}! Manage your adventure bookings below.</p>
        </div>
      </div>

      <div className="bookings-content">
        {error && <p className="error-text">{error}</p>}

        {bookings.length === 0 && !error && (
          <div className="no-bookings">
            <div className="no-bookings-icon">🌍</div>
            <h2>No Bookings Yet</h2>
            <p>Start exploring Kenya's incredible destinations and book your first adventure!</p>
            <a href="/destinations" className="btn-book-now">
              Explore Destinations →
            </a>
          </div>
        )}

        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-image">
                {booking.destination?.imageUrl && (
                  <img src={booking.destination.imageUrl} alt={booking.destination.name} />
                )}
              </div>

              <div className="booking-details">
                <div className="booking-title-row">
                  <h3>{booking.destination?.name || 'Unknown Destination'}</h3>
                  <span
                    className="booking-status"
                    style={{ background: `${statusColor[booking.status]}20`, color: statusColor[booking.status] }}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="booking-location">
                  📍 {booking.destination?.location || ''}
                </p>

                <div className="booking-meta">
                  <span>📅 {formatDate(booking.startDate)} → {formatDate(booking.endDate)}</span>
                  <span>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                  <span className="booking-total-price">
                    💰 ${booking.totalPrice.toFixed(2)} total
                  </span>
                </div>

                {booking.notes && (
                  <p className="booking-notes">📝 {booking.notes}</p>
                )}

                <p className="booking-date">
                  Booked on {formatDate(booking.createdAt)}
                </p>
              </div>

              <div className="booking-actions">
                {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancelling === booking.id}
                  >
                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
