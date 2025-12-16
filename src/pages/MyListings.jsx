import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getListings, deleteListing } from '../services/listing'

function MyListings() {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    listingId: null,
  })

  useEffect(() => {
    const fetchListings = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return

      setLoading(true)
      try {
        const data = await getListings(currentPage, 10)
        setListings(data.content)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error('Error fetching listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [currentPage])

  const handleRemoveListing = (listingId) => {
    setConfirmDelete({ show: true, listingId })
  }

  const confirmRemoveListing = async () => {
    const listingId = confirmDelete.listingId
    setConfirmDelete({ show: false, listingId: null })
    setDeletingId(listingId)
    setMessage({ text: '', type: '' })

    try {
      await deleteListing(listingId)


      // Remove the listing from the current view
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== listingId),
      )

      setMessage({ text: 'Listing removed successfully!', type: 'success' })


      // Clear message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err) {
      console.error('Error deleting listing:', err)
      setMessage({
        text: err.response?.data?.message || 'Failed to remove listing. Please try again.',
        type: 'error'
      })
    } finally {
      setDeletingId(null)
    }
  }

  const cancelRemoveListing = () => {
    setConfirmDelete({ show: false, listingId: null })
  }

  const handleEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <>
      <NavBar />

      {/* Confirmation Dialog */}
      {confirmDelete.show && (
        <div
          id="confirm-delete-overlay"
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
        >
          <div
            id="confirm-delete-dialog"
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '400px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Confirm Removal</h2>
            <p id="confirm-delete-message">
              Are you sure you want to remove this listing? Any pending booking
              requests will be cancelled.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '20px',
              }}
            >
              <button
                id="confirm-delete-cancel"
                onClick={cancelRemoveListing}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-confirm"
                onClick={confirmRemoveListing}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '30px' }}>
          My Listings
        </h1>

        {message.text && (
          <div
            id="message-banner"
            style={{
              padding: '12px 20px',
              marginBottom: '20px',
              borderRadius: '5px',
              backgroundColor:
                message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div
            id="listings-loading"
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
            style={{
              textAlign: 'center',
              padding: '40px',
              fontSize: '16px',
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
            }}
          >
            You don't have any listings yet.
          </div>
        ) : (
          <>
            <div
              id="listings-container"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '20px',
              }}
            >
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  id={`listing-${listing.id}`}
                  data-testid={`listing-${listing.id}`}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3
                    id={`listing-title-${listing.id}`}
                    style={{
                      marginTop: 0,
                      marginBottom: '10px',
                      fontSize: '20px',
                      color: '#333',
                    }}
                  >
                    {listing.title}
                  </h3>
                  <p
                    id={`listing-description-${listing.id}`}
                    style={{
                      color: '#666',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      marginBottom: '12px',
                    }}
                  >
                    {listing.description}
                  </p>
                  <p
                    id={`listing-price-${listing.id}`}
                    style={{
                      fontWeight: 'bold',
                      color: '#667eea',
                      fontSize: '22px',
                      marginBottom: '10px',
                    }}
                  >
                    €{listing.price}
                  </p>
                  <p
                    id={`listing-vehicle-${listing.id}`}
                    style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Vehicle:</strong> {listing.vehicle?.type} -{' '}
                    {listing.vehicle?.condition}
                  </p>
                  <p
                    id={`listing-state-${listing.id}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      backgroundColor:
                        listing.state === 'AVAILABLE' ? '#d4edda' : '#e2e3e5',
                      color:
                        listing.state === 'AVAILABLE' ? '#155724' : '#383d41',
                      marginBottom: '10px',
                    }}
                  >
                    {listing.state}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      id={`edit-listing-${listing.id}`}
                      data-testid={`edit-listing-${listing.id}`}
                      onClick={() => handleEditListing(listing.id)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#5568d3'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#667eea'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      id={`remove-listing-${listing.id}`}
                      data-testid={`remove-listing-${listing.id}`}
                      onClick={() => handleRemoveListing(listing.id)}
                      disabled={deletingId === listing.id}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        backgroundColor:
                          deletingId === listing.id ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor:
                          deletingId === listing.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {deletingId === listing.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
              {listings.map((listing) => {
                const listingId = String(listing.id)
                return (
                  <div
                    key={listingId}
                    id={`listing-${listingId}`}
                    data-testid={`listing-${listingId}`}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <h3
                      id={`listing-title-${listingId}`}
                      style={{
                        marginTop: 0,
                        marginBottom: '10px',
                        fontSize: '20px',
                        color: '#333'
                      }}
                    >
                      {listing.title}
                    </h3>
                    <p
                      id={`listing-description-${listingId}`}
                      style={{
                        color: '#666',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        marginBottom: '12px'
                      }}
                    >
                      {listing.description}
                    </p>
                    <p
                      id={`listing-price-${listingId}`}
                      style={{
                        fontWeight: 'bold',
                        color: '#667eea',
                        fontSize: '22px',
                        marginBottom: '10px'
                      }}
                    >
                      €{listing.price}
                    </p>
                    <p
                      id={`listing-vehicle-${listingId}`}
                      style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '8px'
                      }}
                    >
                      <strong>Vehicle:</strong> {listing.vehicle?.type} - {listing.vehicle?.condition}
                    </p>
                    <p
                      id={`listing-state-${listingId}`}
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        backgroundColor:
                          listing.state === 'AVAILABLE' ? '#d4edda' : '#e2e3e5',
                        color:
                          listing.state === 'AVAILABLE' ? '#155724' : '#383d41',
                      }}
                    >
                      {listing.state}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="button"
                        id={`edit-listing-${listingId}`}
                        onClick={() => navigate(`/edit-listing/${listingId}`)}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        id={`remove-listing-${listingId}`}
                        data-testid={`remove-listing-${listingId}`}
                        onClick={() => handleRemoveListing(listing.id)}
                        disabled={deletingId === listing.id}
                        style={{
                          flex: 1,
                          padding: '8px 16px',
                          backgroundColor: deletingId === listing.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: deletingId === listing.id ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {deletingId === listing.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div
                id="pagination-controls"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: '30px',
                }}
              >
                <button
                  id="pagination-previous"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
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
                        : '0 4px 10px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 0) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 6px 15px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 0) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow =
                        '0 4px 10px rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  Previous
                </button>
                <span
                  id="pagination-info"
                  style={{ fontSize: '15px', fontWeight: '500', color: '#666' }}
                >
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  id="pagination-next"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
                        : '0 4px 10px rgba(102, 126, 234, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage < totalPages - 1) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 6px 15px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage < totalPages - 1) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow =
                        '0 4px 10px rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  )
}

export default MyListings
