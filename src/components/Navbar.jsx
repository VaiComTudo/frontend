function NavBar() {
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>VaiComTudo</h1>
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isLoggedIn ? (
          <>
            <a href="/my-listings" style={{ textDecoration: 'none' }}>
              <button id="nav-my-listings" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>My Listings</button>
            </a>
            <button id="nav-logout" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login" style={{ textDecoration: 'none' }}>
              <button id="nav-login" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Login</button>
            </a>
            <a href="/register" style={{ textDecoration: 'none' }}>
              <button id="nav-register" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Register</button>
            </a>
          </>
        )}
      </div>
    </nav>
  )
}


export default NavBar