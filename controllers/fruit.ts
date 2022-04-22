import axios from 'axios'

const API_URL = `https://www.fruityvice.com/api/fruit/`;

export async function getAllFruit() {
    const list = await axios.get(`${API_URL}all`);
    return list.data;
} 