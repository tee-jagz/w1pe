import { jwtDecode } from 'jwt-decode';

// Get token from local storage
function getToken() {
    let decoded;
    let token;
    if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
    decoded = jwtDecode(token);
    }
    return decoded;
}


export { getToken };
