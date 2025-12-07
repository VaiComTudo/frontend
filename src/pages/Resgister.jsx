import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authentication'
import { useUser } from '../context/UserContext'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

function Register() {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

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
      const response = await register(formData)
      console.log('Registration successful:', response)

      // The backend returns a JWT object like { token: '...' }
      const token = response?.token
      if (token) {
        // Set user in context to the token string
        setUser(token)

        // Persist token under the `token` key (used by getAuthHeaders)
        localStorage.setItem('token', token)
      } else if (response.user) {
        setUser(response.user)
      }

      navigate('/explore')
    } catch (err) {
      console.error('Error registering:', err)
      setError(err?.response?.data?.String || 'Failed to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <NavBar />
      <main
        id="register-page"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '20px',
        }}
      >
        <div
          id="register-container"
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <h2 id="register-title" style={{ marginTop: 0, textAlign: 'center' }}>
            Register
          </h2>

          {error && (
            <div
              id="register-error"
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

          <form id="register-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="register-name"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Name *
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
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
                htmlFor="register-email"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Email *
              </label>
              <input
                id="register-email"
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
                htmlFor="register-password"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Password *
              </label>
              <input
                id="register-password"
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

            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="register-birthdate"
                style={{ display: 'block', marginBottom: '5px' }}
              >
                Birthdate *
              </label>
              <input
                id="register-birthdate"
                type="date"
                name="birthdate"
                value={formData.birthdate}
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
              id="register-submit-btn"
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div
            id="register-login-link"
            style={{ marginTop: '15px', textAlign: 'center' }}
          >
            <span>Already have an account? </span>
            <a
              id="login-link"
              href="/login"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              Login
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Register
