import axios from 'axios'
import { OWNERS_API, RENTERS_API } from '../utils/constants'
import { getAuthHeaders } from '../utils/utils'

export const addListing = async (data) => {
  const response = await axios.post(
    `${OWNERS_API}/listings`,
    data,
    {
      headers: getAuthHeaders(),
    },
  )
  return response.data
}

export const getListings = async (category = null, location = null) => {
  const params = {}
  if (category) params.category = category
  if (location) params.location = location

  const response = await axios.get(
    `${RENTERS_API}/listings`,
    {
      params,
      headers: getAuthHeaders(),
    },
  )
  return response.data
}
