import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <NavBar />

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <div
          id="hero-section"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '80px 20px',
            textAlign: 'center',
          }}
        >
          <h1
            id="hero-title"
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome to VaiComTudo
          </h1>
          <p
            id="hero-subtitle"
            style={{
              fontSize: '24px',
              margin: '0 0 40px 0',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.5',
            }}
          >
            Your trusted platform for renting vehicles. Find the perfect bike,
            scooter, or any vehicle for your needs.
          </p>
          <button
            id="hero-cta-button"
            onClick={() => navigate('/explore')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Explore Listings
          </button>
        </div>

        {/* Features Section */}
        <div
          id="features-section"
          style={{
            padding: '60px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <h2
            id="features-title"
            style={{
              textAlign: 'center',
              fontSize: '36px',
              marginBottom: '50px',
              color: '#333',
            }}
          >
            Why Choose VaiComTudo?
          </h2>

          <div
            id="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
            }}
          >
            {/* Feature 1 */}
            <div
              id="feature-1"
              className="feature-card"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                }}
              >
                🚲
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  marginBottom: '10px',
                  color: '#333',
                }}
              >
                Wide Selection
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                }}
              >
                Choose from a variety of bikes, scooters, and other vehicles to
                suit your needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              id="feature-2"
              className="feature-card"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                }}
              >
                💰
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  marginBottom: '10px',
                  color: '#333',
                }}
              >
                Affordable Prices
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                }}
              >
                Find great deals on quality vehicles at competitive prices for
                any budget.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              id="feature-3"
              className="feature-card"
              style={{
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                }}
              >
                ⚡
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  marginBottom: '10px',
                  color: '#333',
                }}
              >
                Easy Booking
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                }}
              >
                Simple and quick rental process. Book your vehicle in just a few
                clicks.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div
          id="cta-section"
          style={{
            backgroundColor: '#f8f9fa',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <h2
            id="cta-title"
            style={{
              fontSize: '32px',
              marginBottom: '20px',
              color: '#333',
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            id="cta-description"
            style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '30px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Browse our listings and find the perfect vehicle for your next
            adventure.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              id="cta-explore-button"
              onClick={() => navigate('/explore')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.backgroundColor = '#5568d3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.backgroundColor = '#667eea'
              }}
            >
              Browse Listings
            </button>
            {!isLoggedIn && (
              <button
                id="cta-login-button"
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
