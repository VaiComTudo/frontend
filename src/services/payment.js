import axios from 'axios'
import { API_URL } from '../utils/constants'
import { getAuthHeaders } from '../utils/utils'

export const completeBookingPayment = async (bookingId, rentalFee, deposit) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/payments/bookings/${bookingId}/complete`,
    {
      rentalFee,
      deposit,
    },
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}

export const getBookingPayment = async (bookingId) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/v1/payments/bookings/${bookingId}`,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}

