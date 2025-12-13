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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          id="register-container"
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <h2 id="register-title" style={{ marginTop: 0, textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '30px' }}>
            Create Account
          </h2>

          {error && (
            <div
              id="register-error"
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

          <form id="register-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="register-name"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="register-email"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="register-password"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label
                htmlFor="register-birthdate"
                style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                background: isSubmitting ? 'linear-gradient(135deg, #999 0%, #777 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div
            id="register-login-link"
            style={{ marginTop: '20px', textAlign: 'center', fontSize: '15px' }}
          >
            <span style={{ color: '#666' }}>Already have an account? </span>
            <a
              id="login-link"
              href="/login"
              style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
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
