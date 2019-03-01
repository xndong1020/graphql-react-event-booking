import axios from 'axios'

const getAxiosOptions = () => {
  const sub = localStorage.getItem('sub')
  const token = localStorage.getItem('token')
  let options = {
    baseURL:
      process.env.REACT_APP_GRAPHQL_ENDPOINT_URL || 'http://localhost:4000',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
  }

  if (sub && token) {
    const { headers } = options
    const newHeaders = { ...headers, Authorization: `Bearer ${token}` }
    options['headers'] = newHeaders
  }

  return options
}
const instance = axios.create(getAxiosOptions())

export default instance
