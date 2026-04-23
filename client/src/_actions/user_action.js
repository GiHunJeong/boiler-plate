import axios from "axios";
import {
    AUTH_USER,
    LOGIN_USER,
    REGISTER_USER
} from './types';

// 로그인
export function loginUser(dataToSubmit) {
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(res => res.data)
   
    return {
        type: LOGIN_USER,
        payload: request
    }
}

// 회원가입
export function registerUser(dataToSubmit) {
    const request = axios.post('/api/users/register', dataToSubmit)
        .then(res => res.data)
    return {
        type: REGISTER_USER,
        payload: request
    }
}

// auth
export function auth() {
    const request = axios.get('/api/users/auth')
        .then(res => res.data)
    return {
        type: AUTH_USER,
        payload: request
    }
}