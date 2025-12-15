import axios from 'axios'
import { API_URL } from '../utils/constants'
import { getAuthHeaders } from '../utils/utils'

const BOOKING_API = `${API_URL}/bookings`

export const createBooking = async (bookingData) => {
  const response = await axios.post(
    BOOKING_API,
    bookingData,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const getRenterBookings = async () => {
  const response = await axios.get(
    `${BOOKING_API}/renter`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const getOwnerBookings = async () => {
  const response = await axios.get(
    `${BOOKING_API}/owner`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const getBooking = async (bookingId) => {
  const response = await axios.get(
    `${BOOKING_API}/${bookingId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const updateBookingState = async (bookingId, state) => {
  const response = await axios.patch(
    `${BOOKING_API}/${bookingId}/state`,
    { state },
    {
      headers: getAuthHeaders(),
    }
  )
  return response.data
}

export const cancelBooking = async (bookingId) => {
  const response = await axios.delete(
    `${BOOKING_API}/${bookingId}`,
    {
      headers: getAuthHeaders(),
    }
  )
  return response
}
