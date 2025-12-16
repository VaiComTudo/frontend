import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getRenterBookings, cancelBooking } from '../services/booking'
import './MyBookings.css'

function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isLoggedIn = !!localStorage.getItem('token')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [isLoggedIn, navigate])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRenterBookings()
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await cancelBooking(bookingId)
      fetchBookings() // Refresh the list
    } catch (err) {
      console.error('Error canceling booking:', err)
      alert(err.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusClass = (state) => {
    const statusMap = {
      REQUESTED: 'status-pending',
      ACCEPTED: 'status-approved',
      DENIED: 'status-denied',
      CANCELLED: 'status-cancelled',
      IN_PROGRESS: 'status-in-progress',
      RETURNED: 'status-completed',
      STOLEN: 'status-stolen',
    }
    return statusMap[state] || ''
  }

  const getStatusLabel = (state) => {
    const labelMap = {
      REQUESTED: 'Pending',
      ACCEPTED: 'Approved',
      DENIED: 'Denied',
      CANCELLED: 'Cancelled',
      IN_PROGRESS: 'In Progress',
      RETURNED: 'Completed',
      STOLEN: 'Stolen',
    }
    return labelMap[state] || state
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="main-content">
        <div className="bookings-container">
          <h1>My Bookings</h1>
          <p className="subtitle">View and manage your rental bookings</p>

          {loading && (
            <div className="loading-message">Loading bookings...</div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && bookings.length === 0 && (
            <div className="empty-state">
              <p>You haven't made any bookings yet.</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/explore')}
              >
                Explore Listings
              </button>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.listingTitle}</h3>
                    <span className={`status-badge ${getStatusClass(booking.state)}`}>
                      {getStatusLabel(booking.state)}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Owner:</span>
                      <span className="detail-value">{booking.ownerName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pickup:</span>
                      <span className="detail-value">
                        {formatDateTime(booking.pickupDateTime)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Dropoff:</span>
                      <span className="detail-value">
                        {formatDateTime(booking.dropoffDateTime)}
                      </span>
                    </div>
                  </div>

                  {booking.state === 'REQUESTED' && (
                    <div className="booking-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}

                  {booking.state === 'ACCEPTED' && (
                    <div className="booking-message info">
                      Your booking has been approved! Please coordinate with the owner for pickup.
                    </div>
                  )}

                  {booking.state === 'DENIED' && (
                    <div className="booking-message warning">
                      This booking request was denied by the owner.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MyBookings
