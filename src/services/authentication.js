import axios from 'axios'
import { AUTH_API } from '../utils/constants'

export const register = async (data, role) => {
  const body = { ...data, role }
  const response = await axios.post(`${AUTH_API}/register?role=${role}`, body)
  return response.data
}
