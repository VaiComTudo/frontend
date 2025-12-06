export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('token missing')
    return {}
  }
  return { Authorization: `Bearer ${token}` }
}
