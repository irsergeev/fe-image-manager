import axios from 'axios';

export default axios.create(
{
  baseURL: `http://localhost:5186`,
  headers: { Accept: 'application/json' }
});