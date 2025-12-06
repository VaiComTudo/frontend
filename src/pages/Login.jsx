import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { login } from '../services/authentication'
import { useUser } from '../context/UserContext'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser } = useUser()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await login(formData)
      console.log('Login successful:', response)

      // The backend returns a JWT object like { token: '...' }
      const token = response?.token
      if (token) {
        // Set user in context to the token string
        setUser(token)

        // Persist token under the `token` key (used by getAuthHeaders)
        localStorage.setItem('token', token)
      } else {
        // Fallback: set entire response
        setUser(response)
      }

      navigate('/explore')
    } catch (err) {
      console.error('Error logging in:', err)
      setError(err?.response?.data?.String || 'Failed to login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <NavBar />
      <main
        id="login-page"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '20px',
        }}
      >
        <div
          id="login-container"
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <h2 id="login-title" style={{ marginTop: 0, textAlign: 'center' }}>
            Login
          </h2>

          {error && (
            <div
              id="login-error"
              style={{
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '5px',
                marginBottom: '15px',
              }}
            >
              {error}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="login-email"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Email *
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="login-password"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Password *
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
              }}
            >
              {isSubmitting ? 'Logging you in...' : 'Log in'}
            </button>
          </form>

          <div
            id="register-login-link"
            style={{ marginTop: '15px', textAlign: 'center' }}
          >
            <span>Don't have an account yet? </span>
            <a
              id="register-link"
              href="/register"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              Register
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login
