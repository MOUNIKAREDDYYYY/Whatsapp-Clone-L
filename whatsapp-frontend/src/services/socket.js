import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const socket = io(URL, { autoConnect: true });

export default socket;

