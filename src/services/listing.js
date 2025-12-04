import axios from 'axios'
import { OWNERS_API } from '../utils/constants'
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
