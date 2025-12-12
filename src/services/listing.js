import axios from 'axios'
import { OWNERS_API, RENTERS_API } from '../utils/constants'
import { getAuthHeaders } from '../utils/utils'

export const addListing = async (data) => {
  const headers = getAuthHeaders()
  console.log('Auth headers:', headers)
  console.log('Token from localStorage:', localStorage.getItem('token'))

  const response = await axios.post(
    `${OWNERS_API}/listings`,
    data,
    {
      headers,
    },
  )
  return response.data
}

export const getListings = async (page = 0, size = 10, sortBy = 'title', sortDirection = 'asc') => {
  const response = await axios.get(
    `${OWNERS_API}/listings`,
    {
      headers: getAuthHeaders(),
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    },
  )
  return response.data
}

export const getRenterListings = async (category = null, location = null) => {
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
