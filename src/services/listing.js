import axios from 'axios'
import { OWNERS_API, RENTERS_API } from '../utils/constants'
import { getAuthHeaders } from '../utils/utils'

export const addListing = async (data) => {
  const headers = getAuthHeaders()
  console.log('Auth headers:', headers)
  console.log('Token from localStorage:', localStorage.getItem('token'))

  const response = await axios.post(`${OWNERS_API}/listings`, data, {
    headers,
  })
  return response.data
}

export const getListings = async (
  page = 0,
  size = 10,
  sortBy = 'title',
  sortDirection = 'asc',
) => {
  const response = await axios.get(`${OWNERS_API}/listings`, {
    headers: getAuthHeaders(),
    params: {
      page,
      size,
      sortBy,
      sortDirection,
    },
  })
  return response.data
}

export const deleteListing = async (listingId) => {
  const response = await axios.delete(
    `${OWNERS_API}/listings/${listingId}`,
    {
      headers: getAuthHeaders(),
    },
  )
}
export const searchAvailableListings = async ({
  category,
  location,
  minPrice,
  maxPrice,
  page = 0,
  size = 20,
  sortBy = 'title',
  sortDirection = 'asc',
}) => {
  const params = {
    page,
    size,
    sortBy,
    sortDirection,
  }

  if (category) params.category = category
  if (location) params.location = location
  if (minPrice !== undefined && minPrice !== '') params.minPrice = minPrice
  if (maxPrice !== undefined && maxPrice !== '') params.maxPrice = maxPrice

  const response = await axios.get(`${RENTERS_API}/listings`, {
    headers: getAuthHeaders(),
    params,
  })
  return response.data
}

export const getListingById = async (listingId) => {
  const response = await axios.get(`${RENTERS_API}/listings/${listingId}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}
