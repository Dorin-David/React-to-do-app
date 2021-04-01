import axios from 'axios';

//configure axios instance and base url
const axiosInstance = axios.create({
    baseURL: 'https://to-do-list-d5615-default-rtdb.firebaseio.com/'
})

export default axiosInstance