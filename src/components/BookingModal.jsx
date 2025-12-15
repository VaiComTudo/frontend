import { useState } from 'react'
import DateTimePicker from './DateTimePicker'
import { createBooking } from '../services/booking'
import './BookingModal.css'

function BookingModal({ listing, onClose, onSuccess }) {
  const [pickupDateTime, setPickupDateTime] = useState('')
  const [dropoffDateTime, setDropoffDateTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!pickupDateTime || !dropoffDateTime) {
      setError('Please select both pickup and dropoff dates')
      return
    }

    const pickup = new Date(pickupDateTime)
    const dropoff = new Date(dropoffDateTime)

    if (dropoff <= pickup) {
      setError('Dropoff date must be after pickup date')
      return
    }

    setIsSubmitting(true)

    try {
      const bookingData = {
        listingId: listing.id,
        pickupDateTime,
        dropoffDateTime,
      }

      await createBooking(bookingData)
      onSuccess?.()
      // Small delay to ensure parent state updates before modal closes
      setTimeout(() => {
        onClose()
      }, 100)
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err.response?.data?.message || 'Failed to create booking request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" id="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2 id="booking-modal-title">Book: {listing.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="booking-modal-body">
          <div className="listing-info">
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Price:</strong> €{listing.price}/day</p>
            <p><strong>Location:</strong> {listing.pickUpLocation}</p>
          </div>

          <form id="booking-form" onSubmit={handleSubmit}>
            <div className="booking-dates">
              <DateTimePicker
                id="pickup-datetime"
                label="Pickup Date & Time"
                value={pickupDateTime}
                onChange={setPickupDateTime}
                minDate={tomorrow}
              />

              <DateTimePicker
                id="dropoff-datetime"
                label="Dropoff Date & Time"
                value={dropoffDateTime}
                onChange={setDropoffDateTime}
                minDate={pickupDateTime || tomorrow}
              />
            </div>

            {error && <div id="booking-error" className="error-message">{error}</div>}

            <div className="booking-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                id="submit-booking-button"
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
