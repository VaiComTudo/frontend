import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { getListingById, updateListing } from '../services/listing'

function EditListing() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        pickUpLocation: '',
        dropOffLocation: '',
        vehicleType: '',
        vehicleCondition: 'GOOD',
    })
    const [availabilityPeriods, setAvailabilityPeriods] = useState([])
    const [currentPeriod, setCurrentPeriod] = useState({
        startDay: 'MONDAY',
        endDay: 'FRIDAY',
        startTime: '',
        endTime: '',
    })
    const [selectedFiles, setSelectedFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [originalListing, setOriginalListing] = useState(null)

    const daysOfWeek = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
    ]

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const listing = await getListingById(id)

                setOriginalListing(listing)
                setFormData({
                    title: listing.title,
                    description: listing.description,
                    price: listing.price.toString(),
                    pickUpLocation: listing.pickUpLocation,
                    dropOffLocation: listing.dropOffLocation,
                    vehicleType: listing.vehicle?.type || '',
                    vehicleCondition: listing.vehicle?.condition || 'GOOD',
                })
                setAvailabilityPeriods(listing.availability || [])
            } catch (err) {
                console.error('Error fetching listing:', err)
                setError('Failed to load listing')
            } finally {
                setLoading(false)
            }
        }

        fetchListing()
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePeriodChange = (e) => {
        const { name, value } = e.target
        setCurrentPeriod((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const addAvailabilityPeriod = () => {
        if (!currentPeriod.startTime || !currentPeriod.endTime) {
            alert('Please select both start and end times.')
            return
        }
        setAvailabilityPeriods((prev) => [...prev, currentPeriod])
        setCurrentPeriod({
            startDay: 'MONDAY',
            endDay: 'FRIDAY',
            startTime: '',
            endTime: '',
        })
    }

    const removeAvailabilityPeriod = (index) => {
        setAvailabilityPeriods((prev) => prev.filter((_, i) => i !== index))
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64String = reader.result.split(',')[1]
                resolve(base64String)
            }
            reader.onerror = (error) => reject(error)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const processedPhotos = await Promise.all(
                selectedFiles.map(async (file) => {
                    const base64Data = await fileToBase64(file)
                    return { data: base64Data }
                }),
            )

            const processedAvailability = availabilityPeriods.map((period) => ({
                startDay: period.startDay,
                endDay: period.endDay,
                startTime:
                    period.startTime.length === 5
                        ? `${period.startTime}:00`
                        : period.startTime,
                endTime:
                    period.endTime.length === 5 ? `${period.endTime}:00` : period.endTime,
            }))

            const updatedListingData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                state: originalListing.state,
                vehicle: {
                    type: formData.vehicleType,
                    condition: formData.vehicleCondition,
                },
                pickUpLocation: formData.pickUpLocation,
                dropOffLocation: formData.dropOffLocation,
                availability: processedAvailability,
                photos:
                    selectedFiles.length > 0
                        ? processedPhotos
                        : originalListing.photos || [],
            }

            await updateListing(id, updatedListingData)
            navigate('/my-listings')
        } catch (err) {
            console.error('Error updating listing:', err)
            setError(err.response?.data?.message || 'Failed to update listing')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <>
                <NavBar />
                <div
                    id="edit-listing-loading"
                    style={{
                        padding: '40px 20px',
                        minHeight: 'calc(100vh - 200px)',
                        textAlign: 'center',
                        fontSize: '18px',
                        color: '#666',
                    }}
                >
                    Loading...
                </div>
                <Footer />
            </>
        )
    }

    if (error && !originalListing) {
        return (
            <>
                <NavBar />
                <div
                    id="edit-listing-error-container"
                    style={{
                        padding: '40px 20px',
                        minHeight: 'calc(100vh - 200px)',
                        maxWidth: '800px',
                        margin: '0 auto',
                    }}
                >
                    <div
                        id="edit-listing-error-message"
                        style={{
                            padding: '20px',
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            borderRadius: '8px',
                            marginBottom: '20px',
                        }}
                    >
                        {error}
                    </div>
                    <button
                        id="edit-listing-back-button-error"
                        onClick={() => navigate('/my-listings')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                        }}
                    >
                        Back to My Listings
                    </button>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <NavBar />
            <main
                id="edit-listing-container"
                style={{
                    padding: '40px 20px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    minHeight: 'calc(100vh - 200px)',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <button
                        id="edit-listing-back-button"
                        onClick={() => navigate('/my-listings')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: 'white',
                            color: '#667eea',
                            border: '2px solid #667eea',
                            borderRadius: '8px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea'
                            e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white'
                            e.currentTarget.style.color = '#667eea'
                        }}
                    >
                        ← Back to My Listings
                    </button>
                </div>

                <div
                    id="edit-listing-content"
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <h1
                        id="edit-listing-title"
                        style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}
                    >
                        Edit Listing
                    </h1>

                    {error && (
                        <div
                            id="edit-listing-error"
                            style={{
                                padding: '12px',
                                marginBottom: '20px',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                borderRadius: '5px',
                                border: '1px solid #f5c6cb',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form id="edit-listing-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label
                                    id="edit-listing-title-label"
                                    htmlFor="title"
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333',
                                    }}
                                >
                                    Title *
                                </label>
                                <input
                                    id="edit-listing-title-input"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    id="edit-listing-description-label"
                                    htmlFor="description"
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333',
                                    }}
                                >
                                    Description *
                                </label>
                                <textarea
                                    id="edit-listing-description-input"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    id="edit-listing-price-label"
                                    htmlFor="price"
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333',
                                    }}
                                >
                                    Price (€) *
                                </label>
                                <input
                                    id="edit-listing-price-input"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                }}
                            >
                                <div>
                                    <label
                                        id="edit-listing-pickup-label"
                                        htmlFor="pickUpLocation"
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#333',
                                        }}
                                    >
                                        Pick-up Location *
                                    </label>
                                    <input
                                        id="edit-listing-pickup-input"
                                        type="text"
                                        name="pickUpLocation"
                                        value={formData.pickUpLocation}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        id="edit-listing-dropoff-label"
                                        htmlFor="dropOffLocation"
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#333',
                                        }}
                                    >
                                        Drop-off Location *
                                    </label>
                                    <input
                                        id="edit-listing-dropoff-input"
                                        type="text"
                                        name="dropOffLocation"
                                        value={formData.dropOffLocation}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '15px',
                                }}
                            >
                                <div>
                                    <label
                                        id="edit-listing-vehicle-type-label"
                                        htmlFor="vehicleType"
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#333',
                                        }}
                                    >
                                        Vehicle Type *
                                    </label>
                                    <input
                                        id="edit-listing-vehicle-type-input"
                                        type="text"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        id="edit-listing-vehicle-condition-label"
                                        htmlFor="vehicleCondition"
                                        style={{
                                            display: 'block',
                                            marginBottom: '8px',
                                            fontWeight: '600',
                                            color: '#333',
                                        }}
                                    >
                                        Vehicle Condition *
                                    </label>
                                    <select
                                        id="edit-listing-vehicle-condition-select"
                                        name="vehicleCondition"
                                        value={formData.vehicleCondition}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="GOOD">Good</option>
                                        <option value="EXCELLENT">Excellent</option>
                                        <option value="FAIR">Fair</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    id="edit-listing-availability-label"
                                    style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontWeight: '600',
                                        color: '#333',
                                    }}
                                >
                                    Availability Periods
                                </label>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                                        gap: '10px',
                                        marginBottom: '15px',
                                        alignItems: 'end',
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                marginBottom: '5px',
                                                fontSize: '13px',
                                                color: '#666',
                                            }}
                                        >
                                            Start Day
                                        </label>
                                        <select
                                            id="edit-listing-availability-start-day"
                                            name="startDay"
                                            value={currentPeriod.startDay}
                                            onChange={handlePeriodChange}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                border: '1px solid #e0e0e0',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {daysOfWeek.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                marginBottom: '5px',
                                                fontSize: '13px',
                                                color: '#666',
                                            }}
                                        >
                                            End Day
                                        </label>
                                        <select
                                            id="edit-listing-availability-end-day"
                                            name="endDay"
                                            value={currentPeriod.endDay}
                                            onChange={handlePeriodChange}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                border: '1px solid #e0e0e0',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {daysOfWeek.map((day) => (
                                                <option key={day} value={day}>
                                                    {day}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                marginBottom: '5px',
                                                fontSize: '13px',
                                                color: '#666',
                                            }}
                                        >
                                            Start Time
                                        </label>
                                        <input
                                            id="edit-listing-availability-start-time"
                                            type="time"
                                            name="startTime"
                                            value={currentPeriod.startTime}
                                            onChange={handlePeriodChange}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                border: '1px solid #e0e0e0',
                                                fontSize: '13px',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                marginBottom: '5px',
                                                fontSize: '13px',
                                                color: '#666',
                                            }}
                                        >
                                            End Time
                                        </label>
                                        <input
                                            id="edit-listing-availability-end-time"
                                            type="time"
                                            name="endTime"
                                            value={currentPeriod.endTime}
                                            onChange={handlePeriodChange}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                border: '1px solid #e0e0e0',
                                                fontSize: '13px',
                                            }}
                                        />
                                    </div>

                                    <button
                                        id="edit-listing-add-availability-button"
                                        type="button"
                                        onClick={addAvailabilityPeriod}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>

                                {availabilityPeriods.length > 0 && (
                                    <div
                                        id="edit-listing-availability-list"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}
                                    >
                                        {availabilityPeriods.map((period, index) => (
                                            <div
                                                key={index}
                                                id={`edit-listing-availability-period-${index}`}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '5px',
                                                    fontSize: '13px',
                                                }}
                                            >
                                                <span>
                                                    {period.startDay} - {period.endDay}:{' '}
                                                    {period.startTime} - {period.endTime}
                                                </span>
                                                <button
                                                    id={`edit-listing-remove-availability-${index}`}
                                                    type="button"
                                                    onClick={() => removeAvailabilityPeriod(index)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    id="edit-listing-photos-label"
                                    htmlFor="photos"
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#333',
                                    }}
                                >
                                    Photos (Optional - leave empty to keep existing photos)
                                </label>
                                <input
                                    id="edit-listing-photos-input"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '14px',
                                    }}
                                />
                                {selectedFiles.length > 0 && (
                                    <p
                                        id="edit-listing-photos-count"
                                        style={{
                                            marginTop: '8px',
                                            fontSize: '13px',
                                            color: '#666',
                                        }}
                                    >
                                        {selectedFiles.length} new file(s) selected
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button
                                    id="edit-listing-cancel-button"
                                    type="button"
                                    onClick={() => navigate('/my-listings')}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    id="edit-listing-submit-button"
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: isSubmitting ? '#ccc' : '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Listing'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default EditListing