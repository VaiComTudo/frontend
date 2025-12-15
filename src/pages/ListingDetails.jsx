import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getListingById } from '../services/listing'

function ListingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const data = await getListingById(id)
        console.log(data)
        setListing(data)
      } catch (err) {
        console.error('Error fetching listing:', err)
        setError(
          err.response?.data?.message || 'Failed to load listing details',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const getDayOfWeekName = (dayCode) => {
    const days = {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday',
    }
    return days[dayCode] || dayCode
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div
          id="listing-details-loading"
          style={{
            padding: '40px 20px',
            minHeight: 'calc(100vh - 200px)',
            textAlign: 'center',
            fontSize: '18px',
            color: '#666',
          }}
        >
          Loading...
        </div>
        <Footer />
      </>
    )
  }

  if (error || !listing) {
    return (
      <>
        <NavBar />
        <div
          id="listing-details-error-container"
          style={{
            padding: '40px 20px',
            minHeight: 'calc(100vh - 200px)',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            id="listing-details-error-message"
            style={{
              padding: '20px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            {error || 'Listing not found'}
          </div>
          <button
            id="listing-details-back-to-explore-error"
            onClick={() => navigate('/explore')}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
            }}
          >
            Back to Explore
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div
        id="listing-details-container"
        style={{
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Back Button */}
        <button
          id="listing-details-back-button"
          onClick={() => navigate('/explore')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '8px',
            fontWeight: '600',
            marginBottom: '20px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#667eea'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#667eea'
          }}
        >
          ← Back to Explore
        </button>

        {/* Main Content */}
        <div
          id="listing-details-content"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* Title and Price */}
          <div
            id="listing-details-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px',
            }}
          >
            <h1
              id="listing-details-title"
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
                color: '#333',
              }}
            >
              {listing.title}
            </h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '15px',
              }}
            >
              <div
                id="listing-details-price"
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#667eea',
                }}
              >
                €{listing.price}
              </div>
              <button
                id="listing-details-book-button"
                onClick={() => {}}
                style={{
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            id="listing-details-image-container"
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              marginBottom: '30px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {listing.photos && listing.photos.length > 0 ? (
              <img
                id="listing-details-image"
                src={`data:image/jpeg;base64,${listing.photos[0].url}`}
                alt={listing.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                id="listing-details-image-placeholder"
                style={{
                  textAlign: 'center',
                  color: '#999',
                }}
              >
                <svg
                  id="listing-details-image-placeholder-icon"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginBottom: '10px' }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p id="listing-details-image-placeholder-text">
                  No image available
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div
            id="listing-details-description-section"
            style={{ marginBottom: '30px' }}
          >
            <h2
              id="listing-details-description-heading"
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '15px',
              }}
            >
              Description
            </h2>
            <p
              id="listing-details-description-text"
              style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              {listing.description}
            </p>
          </div>

          {/* Location Details */}
          <div
            id="listing-details-locations"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <div
              id="listing-details-pickup-location-card"
              style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <h3
                id="listing-details-pickup-location-heading"
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px',
                }}
              >
                Pick-up Location
              </h3>
              <p
                id="listing-details-pickup-location-text"
                style={{ fontSize: '16px', color: '#666', margin: 0 }}
              >
                {listing.pickUpLocation || 'Not specified'}
              </p>
            </div>
            <div
              id="listing-details-dropoff-location-card"
              style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <h3
                id="listing-details-dropoff-location-heading"
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px',
                }}
              >
                Drop-off Location
              </h3>
              <p
                id="listing-details-dropoff-location-text"
                style={{ fontSize: '16px', color: '#666', margin: 0 }}
              >
                {listing.dropOffLocation || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Vehicle Information */}
          {listing.vehicle && (
            <div
              id="listing-details-vehicle-section"
              style={{ marginBottom: '30px' }}
            >
              <h2
                id="listing-details-vehicle-heading"
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '15px',
                }}
              >
                Vehicle Information
              </h2>
              <div
                id="listing-details-vehicle-info"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                }}
              >
                <div id="listing-details-vehicle-type">
                  <strong style={{ color: '#333' }}>Type:</strong>{' '}
                  <span
                    id="listing-details-vehicle-type-value"
                    style={{ color: '#666' }}
                  >
                    {listing.vehicle.type}
                  </span>
                </div>
                <div id="listing-details-vehicle-condition">
                  <strong style={{ color: '#333' }}>Condition:</strong>{' '}
                  <span
                    id="listing-details-vehicle-condition-value"
                    style={{ color: '#666' }}
                  >
                    {listing.vehicle.condition}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Availability */}
          {listing.availability && listing.availability.length > 0 && (
            <div id="listing-details-availability-section">
              <h2
                id="listing-details-availability-heading"
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '15px',
                }}
              >
                Availability
              </h2>
              <div
                id="listing-details-availability-list"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px',
                }}
              >
                {listing.availability.map((period, index) => (
                  <div
                    key={index}
                    id={`listing-details-availability-period-${index}`}
                    style={{
                      padding: '15px',
                      backgroundColor: '#f0f4ff',
                      borderRadius: '8px',
                      border: '1px solid #d0dbf5',
                    }}
                  >
                    <div
                      id={`listing-details-availability-days-${index}`}
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '8px',
                      }}
                    >
                      {getDayOfWeekName(period.startDay)} -{' '}
                      {getDayOfWeekName(period.endDay)}
                    </div>
                    <div
                      id={`listing-details-availability-time-${index}`}
                      style={{ fontSize: '14px', color: '#666' }}
                    >
                      {period.startTime} - {period.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ListingDetails
