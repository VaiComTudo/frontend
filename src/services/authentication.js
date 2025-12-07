import axios from 'axios'
import { AUTH_API } from '../utils/constants'

export const register = async (data) => {
  const role = 'NORMAL_USER'
  const body = { ...data, role }
  const response = await axios.post(`${AUTH_API}/register?role=${role}`, body)
  return response.data
}

export const login = async (data) => {
  const body = { ...data }
  const response = await axios.post(`${AUTH_API}/login`, body)
  return response.data
}
