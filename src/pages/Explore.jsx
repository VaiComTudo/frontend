import { useState } from 'react'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { useUser } from '../context/UserContext'
import { addListing } from '../services/listing'

function Explore() {
  const { user: token } = useUser()
  const [showModal, setShowModal] = useState(false)

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
  // Stores the list of periods to be submitted
  const [availabilityPeriods, setAvailabilityPeriods] = useState([])
  // Stores the temporary state for the "Add Period" sub-form
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

  const daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle inputs for the "Add Availability" sub-form
  const handlePeriodChange = (e) => {
    const { name, value } = e.target
    setCurrentPeriod((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add the current period to the list
  const addAvailabilityPeriod = () => {
    if (!currentPeriod.startTime || !currentPeriod.endTime) {
      alert('Please select both start and end times.')
      return
    }
    setAvailabilityPeriods((prev) => [...prev, currentPeriod])
    // Reset time fields for convenience, keep days
    setCurrentPeriod((prev) => ({
      ...prev,
      startTime: '',
      endTime: '',
    }))
  }

  // Remove a period from the list
  const removeAvailabilityPeriod = (index) => {
    setAvailabilityPeriods((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  // Helper: Convert file to Base64 and strip the data URL prefix
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Remove "data:image/png;base64," prefix to get raw bytes for Java byte[]
        const base64String = reader.result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setError('No user logged in')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Process Photos
      const processedPhotos = await Promise.all(
        selectedFiles.map(async (file) => {
          const base64Data = await fileToBase64(file)
          return { data: base64Data } // Matches ListingPhoto entity structure
        })
      )

      // 2. Process Availability
      // Ensure time formats are HH:mm:ss (or HH:mm is often accepted, but :00 is safer)
      const processedAvailability = availabilityPeriods.map((period) => ({
        startDay: period.startDay,
        endDay: period.endDay,
        // Append seconds if missing, assuming input type="time" gives HH:mm
        startTime: period.startTime.length === 5 ? `${period.startTime}:00` : period.startTime,
        endTime: period.endTime.length === 5 ? `${period.endTime}:00` : period.endTime,
      }))


      // 3. Construct payload
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
        
        // Mapped collections
        availability: processedAvailability,
        photos: processedPhotos,
      }

      console.log('Sending Payload:', listingData)

      const response = await addListing(listingData)

      console.log('Listing created:', response)
      setSuccess(true)

      // Reset all form states
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

      // Close modal after 2 seconds, keep success flag a bit longer for the toast
      setTimeout(() => {
        setShowModal(false)
      }, 2000)
      // Hide success toast after 3 seconds
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

      {/* Success toast */}
      {success && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '12px 18px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 2000,
          fontWeight: '600'
        }}>
          Listing created successfully!
        </div>
      )}

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Add New Listing
        </button>

        {showModal && (
          <div
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
              style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0 }}>Create New Listing</h2>

              {success && (
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '5px',
                    marginBottom: '15px',
                  }}
                >
                  Listing created successfully!
                </div>
              )}

              {error && (
                <div
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

              <form onSubmit={handleSubmit}>
                {/* --- Basic Info --- */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Price (€) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Vehicle Condition *</label>
                    <select
                      name="vehicleCondition"
                      value={formData.vehicleCondition}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="NEEDS_WORK">Needs Work</option>
                      <option value="POOR">Poor</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Vehicle Type *</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Bike, Scooter"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Pick-up Location *</label>
                    <input
                      type="text"
                      name="pickUpLocation"
                      value={formData.pickUpLocation}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Drop-off Location *</label>
                    <input
                      type="text"
                      name="dropOffLocation"
                      value={formData.dropOffLocation}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                {/* --- Photos Section --- */}
                <div style={{ marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '10px' }}
                  />
                  {selectedFiles.length > 0 && (
                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                {/* --- Availability Section --- */}
                <div style={{ marginBottom: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Availability Periods</label>
                  
                  {/* Add New Period Sub-form */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                    <div style={{ flex: '1 1 120px' }}>
                      <label style={{ fontSize: '0.85em' }}>Start Day</label>
                      <select
                        name="startDay"
                        value={currentPeriod.startDay}
                        onChange={handlePeriodChange}
                        style={{ width: '100%', padding: '5px' }}
                      >
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: '1 1 120px' }}>
                      <label style={{ fontSize: '0.85em' }}>End Day</label>
                      <select
                        name="endDay"
                        value={currentPeriod.endDay}
                        onChange={handlePeriodChange}
                        style={{ width: '100%', padding: '5px' }}
                      >
                         {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                      <label style={{ fontSize: '0.85em' }}>Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={currentPeriod.startTime}
                        onChange={handlePeriodChange}
                        style={{ width: '100%', padding: '5px' }}
                      />
                    </div>
                    <div style={{ flex: '1 1 100px' }}>
                      <label style={{ fontSize: '0.85em' }}>End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={currentPeriod.endTime}
                        onChange={handlePeriodChange}
                        style={{ width: '100%', padding: '5px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addAvailabilityPeriod}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '1px' // align with inputs
                      }}
                    >
                      Add
                    </button>
                  </div>

                  {/* List of Added Periods */}
                  {availabilityPeriods.length > 0 && (
                    <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em' }}>
                        {availabilityPeriods.map((p, idx) => (
                          <li key={idx} style={{ marginBottom: '5px' }}>
                            {p.startDay} to {p.endDay} ({p.startTime} - {p.endTime})
                            <button
                              type="button"
                              onClick={() => removeAvailabilityPeriod(idx)}
                              style={{
                                marginLeft: '10px',
                                color: '#dc3545',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
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

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: '10px 20px',
                      cursor: 'pointer',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '10px 20px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                    }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default Explore