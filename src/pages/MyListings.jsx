import { useState, useEffect } from 'react'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getListings } from '../services/listing'

function MyListings() {
  const [listings, setListings] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

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

  return (
    <>
      <NavBar />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <h1>My Listings</h1>

        {loading ? (
          <div
            id="listings-loading"
            style={{ textAlign: 'center', padding: '20px' }}
          >
            Loading...
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
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: 'white',
                  }}
                >
                  <h3
                    id={`listing-title-${listing.id}`}
                    style={{ marginTop: 0 }}
                  >
                    {listing.title}
                  </h3>
                  <p
                    id={`listing-description-${listing.id}`}
                    style={{ color: '#666', fontSize: '14px' }}
                  >
                    {listing.description}
                  </p>
                  <p
                    id={`listing-price-${listing.id}`}
                    style={{ fontWeight: 'bold', color: '#007bff' }}
                  >
                    €{listing.price}
                  </p>
                  <p
                    id={`listing-vehicle-${listing.id}`}
                    style={{ fontSize: '12px', color: '#888' }}
                  >
                    {listing.vehicle?.type} - {listing.vehicle?.condition}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                id="pagination-controls"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '15px',
                  marginTop: '20px',
                }}
              >
                <button
                  id="pagination-previous"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 0}
                  style={{
                    padding: '8px 16px',
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    backgroundColor: currentPage === 0 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  Previous
                </button>
                <span id="pagination-info">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  id="pagination-next"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage >= totalPages - 1}
                  style={{
                    padding: '8px 16px',
                    cursor:
                      currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                    backgroundColor:
                      currentPage >= totalPages - 1 ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
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
