import axios from 'axios'
const instance = axios.create({
  baseURL: process.env.REACT_APP_GRAPHQL_ENDPOINT_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

export default instance
