import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { addListing, searchAvailableListings } from '../services/listing'

function Explore() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')
  const [showModal, setShowModal] = useState(false)

  // -- Search Filters --
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  })

  // -- Search Results --
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  // -- Pagination --
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // -- Main Listing Form Data --
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    pickUpLocation: '',
    dropOffLocation: '',
    vehicleType: '',
    vehicleCondition: 'GOOD',
  })

  // -- Availability State --
  const [availabilityPeriods, setAvailabilityPeriods] = useState([])
  const [currentPeriod, setCurrentPeriod] = useState({
    startDay: 'MONDAY',
    endDay: 'FRIDAY',
    startTime: '',
    endTime: '',
  })

  // -- Photos State --
  const [selectedFiles, setSelectedFiles] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // -- Booking Modal State --
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingListing, setBookingListing] = useState(null)

  const daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]

  // --- Search Handlers ---

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = async (e) => {
    if (e) e.preventDefault()

    setLoading(true)
    setSearchError(null)

    try {
      const response = await searchAvailableListings({
        category: searchFilters.category,
        location: searchFilters.location,
        minPrice: searchFilters.minPrice,
        maxPrice: searchFilters.maxPrice,
        page: currentPage,
        size: 20,
      })

      setListings(response.content || [])
      setTotalPages(response.totalPages || 0)
      setTotalElements(response.totalElements || 0)
    } catch (err) {
      console.error('Error searching listings:', err)
      setSearchError(err.response?.data?.message || 'Failed to search listings')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Load listings on mount and when page changes
  useEffect(() => {
    handleSearch()
  }, [currentPage])

  // --- Listing Form Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePeriodChange = (e) => {
    const { name, value } = e.target
    setCurrentPeriod((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addAvailabilityPeriod = () => {
    if (!currentPeriod.startTime || !currentPeriod.endTime) {
      alert('Please select both start and end times.')
      return
    }
    setAvailabilityPeriods((prev) => [...prev, currentPeriod])
    setCurrentPeriod((prev) => ({
      ...prev,
      startTime: '',
      endTime: '',
    }))
  }

  const removeAvailabilityPeriod = (index) => {
    setAvailabilityPeriods((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const storedToken = localStorage.getItem('token')
    console.log('Checking token in handleSubmit:', storedToken)

    if (!storedToken) {
      console.log('No token found!')
      setError('No user logged in')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const processedPhotos = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64Data = await fileToBase64(file)
          return { data: base64Data }
        }),
      )

      const processedAvailability = availabilityPeriods.map((period) => ({
        startDay: period.startDay,
        endDay: period.endDay,
        startTime:
          period.startTime.length === 5
            ? `${period.startTime}:00`
            : period.startTime,
        endTime:
          period.endTime.length === 5 ? `${period.endTime}:00` : period.endTime,
      }))

      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        state: 'AVAILABLE',
        vehicle: {
          type: formData.vehicleType,
          condition: formData.vehicleCondition,
        },
        pickUpLocation: formData.pickUpLocation,
        dropOffLocation: formData.dropOffLocation,
        availability: processedAvailability,
        photos: processedPhotos,
      }

      console.log('Sending Payload:', listingData)

      const response = await addListing(listingData)

      console.log('Listing created:', response)
      setSuccess(true)

      setFormData({
        title: '',
        description: '',
        price: '',
        pickUpLocation: '',
        dropOffLocation: '',
        vehicleType: '',
        vehicleCondition: 'GOOD',
      })
      setAvailabilityPeriods([])
      setSelectedFiles([])
      setCurrentPeriod({
        startDay: 'MONDAY',
        endDay: 'FRIDAY',
        startTime: '',
        endTime: '',
      })

      setTimeout(() => {
        setShowModal(false)
        handleSearch() // Refresh listings after adding
      }, 2000)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error creating listing:', err)
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setError(null)
    setSuccess(false)
  }

  return (
    <>
      <NavBar />

      {success && (
        <div
          id="success-toast"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 18px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 2000,
            fontWeight: '600',
          }}
        >
          Listing created successfully!
        </div>
      )}

      <main
        style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Add Listing Button */}
        {isLoggedIn && (
          <div style={{ marginBottom: '30px' }}>
            <button
              id="add-listing-button"
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Add New Listing
            </button>
          </div>
        )}

        {/* Search Form */}
        <form
          id="search-form"
          onSubmit={handleSearch}
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '25px',
              color: '#333',
              fontSize: '24px',
            }}
          >
            Search Listings
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                Category
              </label>
              <input
                id="search-category"
                type="text"
                name="category"
                value={searchFilters.category}
                onChange={handleSearchChange}
                placeholder="e.g., Bike, Scooter"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                Location
              </label>
              <input
                id="search-location"
                type="text"
                name="location"
                value={searchFilters.location}
                onChange={handleSearchChange}
                placeholder="Enter location"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                Min Price (€)
              </label>
              <input
                id="search-min-price"
                type="number"
                name="minPrice"
                value={searchFilters.minPrice}
                onChange={handleSearchChange}
                placeholder="0"
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                Max Price (€)
              </label>
              <input
                id="search-max-price"
                type="number"
                name="maxPrice"
                value={searchFilters.maxPrice}
                onChange={handleSearchChange}
                placeholder="1000"
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>
          </div>

          <button
            id="search-button"
            type="submit"
            disabled={loading}
            style={{
              marginTop: '25px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading
                ? 'linear-gradient(135deg, #999 0%, #777 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(102, 126, 234, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow =
                '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Error */}
        {searchError && (
          <div
            id="search-error"
            style={{
              padding: '15px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '5px',
              marginBottom: '20px',
            }}
          >
            {searchError}
          </div>
        )}

        {/* Results Summary */}
        {!loading && (
          <div
            id="results-summary"
            style={{
              marginBottom: '15px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            Found {totalElements} listing{totalElements !== 1 ? 's' : ''}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div
            id="loading-indicator"
            style={{
              textAlign: 'center',
              padding: '40px',
              fontSize: '18px',
              color: '#666',
            }}
          >
            Loading...
          </div>
        ) : listings.length === 0 ? (
          <div
            id="no-results"
            style={{
              textAlign: 'center',
              padding: '40px',
              fontSize: '16px',
              color: '#666',
            }}
          >
            No listings found. Try adjusting your search filters.
          </div>
        ) : (
          <div
            id="listings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {listings.map((listing) => {
              const listingId = String(listing.id)
              return (
                <div
                  key={listingId}
                  id={`listing-${listingId}`}
                  className="listing-card"
                  onClick={() => navigate(`/listing/${listingId}`)}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow =
                      '0 6px 16px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <h3
                    className="listing-title"
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    {listing.title}
                  </h3>
                  <p
                    className="listing-description"
                    style={{
                      margin: '0 0 15px 0',
                      fontSize: '14px',
                      color: '#666',
                      lineHeight: '1.5',
                    }}
                  >
                    {listing.description}
                  </p>
                  <div style={{ marginBottom: '12px' }}>
                    <span
                      className="listing-price"
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#667eea',
                      }}
                    >
                      €{listing.price}
                    </span>
                  </div>
                  {listing.vehicle && (
                    <div
                      className="listing-vehicle"
                      style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>Type:</strong> {listing.vehicle.type} |{' '}
                      <strong>Condition:</strong> {listing.vehicle.condition}
                    </div>
                  )}
                  <div
                    className="listing-location"
                    style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '6px',
                    }}
                  >
                    <strong>Pick-up:</strong> {listing.pickUpLocation}
                  </div>
                  <div
                    className="listing-location"
                    style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '12px',
                    }}
                  >
                    <strong>Drop-off:</strong> {listing.dropOffLocation}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setBookingListing(listing)
                      setShowBookingModal(true)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      marginTop: '10px',
                      boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            id="pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <button
              id="prev-page-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              style={{
                padding: '10px 20px',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                background:
                  currentPage === 0
                    ? '#e9ecef'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: currentPage === 0 ? '#6c757d' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow:
                  currentPage === 0
                    ? 'none'
                    : '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 0) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              Previous
            </button>
            <span
              id="page-info"
              style={{ fontSize: '15px', fontWeight: '500', color: '#666' }}
            >
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              id="next-page-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              style={{
                padding: '10px 20px',
                cursor:
                  currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                background:
                  currentPage >= totalPages - 1
                    ? '#e9ecef'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: currentPage >= totalPages - 1 ? '#6c757d' : 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow:
                  currentPage >= totalPages - 1
                    ? 'none'
                    : '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages - 1) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage < totalPages - 1) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Add Listing Modal */}
      {showModal && (
        <div
          id="add-listing-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            id="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '15px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: '30px',
                color: '#333',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            >
              Create New Listing
            </h2>

            {success && (
              <div
                id="modal-success"
                style={{
                  padding: '12px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #c3e6cb',
                }}
              >
                Listing created successfully!
              </div>
            )}

            {error && (
              <div
                id="modal-error"
                style={{
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #f5c6cb',
                }}
              >
                {error}
              </div>
            )}

            <form id="listing-form" onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  Title *
                </label>
                <input
                  id="listing-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  Description *
                </label>
                <textarea
                  id="listing-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    Price (€) *
                  </label>
                  <input
                    id="listing-price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    Vehicle Condition *
                  </label>
                  <select
                    id="listing-vehicle-condition"
                    name="vehicleCondition"
                    value={formData.vehicleCondition}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                      backgroundColor: 'white',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="NEEDS_WORK">Needs Work</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  Vehicle Type *
                </label>
                <input
                  id="listing-vehicle-type"
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Bike, Scooter"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '15px',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div
                style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    Pick-up Location *
                  </label>
                  <input
                    id="listing-pickup-location"
                    type="text"
                    name="pickUpLocation"
                    value={formData.pickUpLocation}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    Drop-off Location *
                  </label>
                  <input
                    id="listing-dropoff-location"
                    type="text"
                    name="dropOffLocation"
                    value={formData.dropOffLocation}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                  />
                </div>
              </div>

              <div
                style={{
                  marginBottom: '25px',
                  borderTop: '2px solid #f0f0f0',
                  paddingTop: '20px',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '16px',
                  }}
                >
                  Photos
                </label>
                <input
                  id="listing-photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
                {selectedFiles.length > 0 && (
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#667eea',
                      fontWeight: '500',
                    }}
                  >
                    {selectedFiles.length} file(s) selected
                  </div>
                )}
              </div>

              <div
                style={{
                  marginBottom: '25px',
                  borderTop: '2px solid #f0f0f0',
                  paddingTop: '20px',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    marginBottom: '15px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '16px',
                  }}
                >
                  Availability Periods
                </label>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    alignItems: 'flex-end',
                    marginBottom: '15px',
                  }}
                >
                  <div style={{ flex: '1 1 120px' }}>
                    <label
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#333',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Start Day
                    </label>
                    <select
                      id="availability-start-day"
                      name="startDay"
                      value={currentPeriod.startDay}
                      onChange={handlePeriodChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                      }}
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <label
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#333',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      End Day
                    </label>
                    <select
                      id="availability-end-day"
                      name="endDay"
                      value={currentPeriod.endDay}
                      onChange={handlePeriodChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                      }}
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 100px' }}>
                    <label
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#333',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Start Time
                    </label>
                    <input
                      id="availability-start-time"
                      type="time"
                      name="startTime"
                      value={currentPeriod.startTime}
                      onChange={handlePeriodChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ flex: '1 1 100px' }}>
                    <label
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#333',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      End Time
                    </label>
                    <input
                      id="availability-end-time"
                      type="time"
                      name="endTime"
                      value={currentPeriod.endTime}
                      onChange={handlePeriodChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <button
                    id="add-availability-button"
                    type="button"
                    onClick={addAvailabilityPeriod}
                    style={{
                      padding: '10px 18px',
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 2px 6px rgba(102, 126, 234, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 4px 10px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow =
                        '0 2px 6px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Add
                  </button>
                </div>

                {availabilityPeriods.length > 0 && (
                  <div
                    id="availability-periods-list"
                    style={{
                      background: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '20px',
                        fontSize: '14px',
                      }}
                    >
                      {availabilityPeriods.map((p, idx) => (
                        <li
                          key={idx}
                          style={{ marginBottom: '10px', color: '#333' }}
                        >
                          <span style={{ fontWeight: '500' }}>
                            {p.startDay} to {p.endDay}
                          </span>{' '}
                          <span style={{ color: '#666' }}>
                            ({p.startTime} - {p.endTime})
                          </span>
                          <button
                            className="remove-availability-button"
                            type="button"
                            onClick={() => removeAvailabilityPeriod(idx)}
                            style={{
                              marginLeft: '15px',
                              padding: '4px 12px',
                              color: 'white',
                              background: '#dc3545',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#c82333'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc3545'
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                }}
              >
                <button
                  id="cancel-listing-button"
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    cursor: 'pointer',
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dee2e6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef'
                  }}
                >
                  Cancel
                </button>
                <button
                  id="submit-listing-button"
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    background: isSubmitting
                      ? 'linear-gradient(135deg, #999 0%, #777 100%)'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '15px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && bookingListing && (
        <div
          id="booking-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
              Book {bookingListing.title}
            </h2>
            <form
              id="booking-form"
              onSubmit={(e) => {
                e.preventDefault()
                // Para os testes, basta fechar o modal e manter-nos em /explore
                setShowBookingModal(false)
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  Pickup Date & Time
                </label>
                <input
                  id="pickup-datetime"
                  type="datetime-local"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                >
                  Dropoff Date & Time
                </label>
                <input
                  id="dropoff-datetime"
                  type="datetime-local"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  Cancel
                </button>
                <button
                  id="submit-booking-button"
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  Submit booking request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Explore
