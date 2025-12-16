import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getOwnerBookings, updateBookingState } from '../services/booking'
import './OwnerBookings.css'

function OwnerBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')

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
      const data = await getOwnerBookings()
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (bookingId, newState) => {
    try {
      await updateBookingState(bookingId, newState)
      fetchBookings() // Refresh the list
    } catch (err) {
      console.error('Error updating booking:', err)
      alert(err.response?.data?.message || 'Failed to update booking')
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

  const filteredBookings = filterStatus === 'ALL'
    ? bookings
    : bookings.filter(booking => booking.state === filterStatus)

  const pendingCount = bookings.filter(b => b.state === 'REQUESTED').length

  return (
    <div className="page-container">
      <NavBar />
      <main className="main-content">
        <div className="bookings-container">
          <div className="header-section">
            <div>
              <h1>Booking Requests</h1>
              <p className="subtitle">
                Manage rental requests for your listings
                {pendingCount > 0 && (
                  <span className="pending-badge">{pendingCount} pending</span>
                )}
              </p>
            </div>
          </div>

          <div className="filter-section">
            <label htmlFor="status-filter">Filter by status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Bookings</option>
              <option value="REQUESTED">Pending Requests</option>
              <option value="ACCEPTED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RETURNED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {loading && (
            <div className="loading-message">Loading bookings...</div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="empty-state">
              {filterStatus === 'ALL' ? (
                <>
                  <p>No booking requests yet.</p>
                  <p className="empty-hint">
                    When renters request your listings, they'll appear here.
                  </p>
                </>
              ) : (
                <p>No bookings with status: {getStatusLabel(filterStatus)}</p>
              )}
            </div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <div className="bookings-grid">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.listingTitle}</h3>
                    <span className={`status-badge ${getStatusClass(booking.state)}`}>
                      {getStatusLabel(booking.state)}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Renter:</span>
                      <span className="detail-value">{booking.renterName}</span>
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
                        className="btn-approve"
                        onClick={() => handleUpdateStatus(booking.id, 'ACCEPTED')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-deny"
                        onClick={() => handleUpdateStatus(booking.id, 'DENIED')}
                      >
                        Deny
                      </button>
                    </div>
                  )}

                  {booking.state === 'ACCEPTED' && (
                    <div className="booking-actions">
                      <button
                        className="btn-status"
                        onClick={() => handleUpdateStatus(booking.id, 'IN_PROGRESS')}
                      >
                        Mark as In Progress
                      </button>
                    </div>
                  )}

                  {booking.state === 'IN_PROGRESS' && (
                    <div className="booking-actions">
                      <button
                        className="btn-status btn-complete"
                        onClick={() => handleUpdateStatus(booking.id, 'RETURNED')}
                      >
                        Mark as Returned
                      </button>
                      <button
                        className="btn-status btn-stolen"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to report this item as stolen?')) {
                            handleUpdateStatus(booking.id, 'STOLEN')
                          }
                        }}
                      >
                        Report Stolen
                      </button>
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

export default OwnerBookings
