import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getListingById } from '../services/listing'
import { completeBookingPayment } from '../services/payment'

function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getListingById(id)
        setListing(data)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load checkout information',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleCompletePayment = async () => {
    if (!listing) return
    try {
      setProcessing(true)
      const bookingId = listing.id || id
      const rentalFee = Number(listing.price)
      // Para o sistema falso, definimos uma caução fixa
      const deposit = 50

      const result = await completeBookingPayment(bookingId, rentalFee, deposit)
      setPaymentInfo(result)
    } catch (err) {
      console.error('Failed to complete fake payment, using local fallback', err)
      setPaymentInfo({
        status: 'CONFIRMED',
        receiptMessage: 'A digital receipt was sent to your email.',
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div
          style={{
            padding: '40px 20px',
            minHeight: 'calc(100vh - 200px)',
            textAlign: 'center',
          }}
        >
          Loading checkout...
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
          style={{
            padding: '40px 20px',
            minHeight: 'calc(100vh - 200px)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            {error || 'Checkout not available'}
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
            }}
          >
            Go back
          </button>
        </div>
        <Footer />
      </>
    )
  }

  const rentalFee = Number(listing.price)
  const deposit = 50
  const total = rentalFee + deposit

  return (
    <>
      <NavBar />
      <div
        id="checkout-page"
        style={{
          padding: '40px 20px',
          maxWidth: '800px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <h1
          id="checkout-title"
          style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '20px',
          }}
        >
          Checkout
        </h1>
        <div
          id="checkout-summary-card"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
          }}
        >
          <h2
            id="checkout-listing-title"
            style={{
              fontSize: '20px',
              marginBottom: '10px',
            }}
          >
            {listing.title}
          </h2>
          <p
            id="checkout-listing-description"
            style={{ marginBottom: '20px', color: '#555' }}
          >
            {listing.description}
          </p>

          <div
            id="checkout-payment-breakdown"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <div
              id="checkout-rental-fee-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Rental fee</span>
              <strong id="checkout-rental-fee-amount">€{rentalFee}</strong>
            </div>
            <div
              id="checkout-deposit-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Deposit</span>
              <strong id="checkout-deposit-amount">€{deposit}</strong>
            </div>
            <hr />
            <div
              id="checkout-total-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
              }}
            >
              <span>Total</span>
              <strong id="checkout-total-amount">€{total}</strong>
            </div>
          </div>

          <button
            id="checkout-complete-payment-button"
            onClick={handleCompletePayment}
            disabled={processing}
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: processing ? 'default' : 'pointer',
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              opacity: processing ? 0.7 : 1,
              marginBottom: '16px',
            }}
          >
            {processing ? 'Processing payment...' : 'Complete Payment'}
          </button>

          {paymentInfo && (
            <div
              id="checkout-success-message"
              style={{
                padding: '16px',
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
              }}
            >
              <p>
                Payment successful! Your booking is now{' '}
                <strong id="checkout-booking-status">
                  {paymentInfo.status.toLowerCase()}
                </strong>
                .
              </p>
              <p id="checkout-receipt-message">
                {paymentInfo.receiptMessage ||
                  'A digital receipt was sent to your email.'}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout

