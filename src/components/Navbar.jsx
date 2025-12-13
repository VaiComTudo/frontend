function NavBar() {
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const textButtonStyle = {
    padding: '10px 16px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'transparent',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
  }

  const primaryButtonStyle = {
    padding: '10px 20px',
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#f8f9fa',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            VaiComTudo
          </h1>
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isLoggedIn ? (
          <>
            <a href="/explore" style={{ textDecoration: 'none' }}>
              <button
                style={textButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Explore
              </button>
            </a>
            <a href="/my-listings" style={{ textDecoration: 'none' }}>
              <button
                id="nav-my-listings"
                style={textButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                My Listings
              </button>
            </a>
            <button
              id="nav-logout"
              onClick={handleLogout}
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/explore" style={{ textDecoration: 'none' }}>
              <button
                style={textButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Explore
              </button>
            </a>
            <a href="/login" style={{ textDecoration: 'none' }}>
              <button
                id="nav-login"
                style={textButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Login
              </button>
            </a>
            <a href="/register" style={{ textDecoration: 'none' }}>
              <button
                id="nav-register"
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                Register
              </button>
            </a>
          </>
        )}
      </div>
    </nav>
  )
}


export default NavBar