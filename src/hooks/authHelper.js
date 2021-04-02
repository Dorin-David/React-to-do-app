import { useReducer, useCallback } from 'react';
import axios from 'axios';

function handleErrorMessage(error) {
    const customErrorMessages = {
        'INVALID_EMAIL': 'Sorry, your email is invalid',
        'EMAIL_EXISTS': 'Sorry, your email is already taken',
        'EMAIL_NOT_FOUND': 'Sorry, we didn\'t find your email',
        'INVALID_PASSWORD': 'Invalid password, please try again',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to unusual activity. Try again later.'
    }
    return (customErrorMessages[error.message] || error.message)
}


const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
}

const authReducer = (state, action) => {
    switch (action.type) {
        case "AUTH_START":
            return {
                ...state,
                error: null,
                loading: true
            }
        case "AUTH_SUCCESS":
            return {
                ...state,
                token: action.token,
                userId: action.userId,
                error: null,
                loading: false
            }
        case "AUTH_FAIL":
            return {
                ...state,
                error: handleErrorMessage(action.error),
                loading: false,
            }
        case "AUTH_LOGOUT":
            return {
                ...state,
                token: null,
                userId: null,
                error: null
            }
        default:
            return initialState
    }
}

const useAuth = () => {
    const [userAuthState, dispatch] = useReducer(authReducer, initialState)

    const authStart = useCallback(() => dispatch({
        type: "AUTH_START"
    }), [])

    const authSuccess = useCallback((token, userId) => dispatch({
        type: "AUTH_SUCCESS",
        token,
        userId
    }), [])

    const authFail = useCallback(error => dispatch({
        type: "AUTH_FAIL",
        error
    }), [])

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('userId')
          dispatch({
            type: "AUTH_LOGOUT"
        })
    }, [])

    const checkAuthTimeout = useCallback(expirationTime => {
        setTimeout(() => {
            logout()
        }, expirationTime * 1000);
    }, [logout])

    const auth = useCallback((email, password, command) => {
        authStart()
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCL98oN6nr0uECgFWmhT6hYOLrAFsusX88';                                                  
        if(command === 'register'){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCL98oN6nr0uECgFWmhT6hYOLrAFsusX88'
        } 

        axios.post(url, authData)
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.localId)
                authSuccess(res.data.idToken, res.data.localId)
                checkAuthTimeout(res.data.expiresIn)
            })
            .catch(rej => {
                authFail(rej.response.data.error)
            })
    }, [authStart,authSuccess, authFail, checkAuthTimeout])

    const authCheckState = useCallback(() => {
        const token = localStorage.getItem('token');
        // console.log('[authHelper triggerd]', token)
        
        return new Promise((res, rej) => {
            if (!token) {
                logout()
                 return res('logged out')
            } else {
                const expirationDate = new Date(localStorage.getItem('expirationDate'));
                if (expirationDate <= new Date()) {
                    logout()
                } else {
                    const userId = localStorage.getItem('userId')
                    authSuccess(token, userId)
                    checkAuthTimeout((expirationDate.getTime() - new Date().getTime() / 1000))
                    res('logged in')
                }
            }

        })
    },[logout, authSuccess, checkAuthTimeout])

    return {
        userAuthState,
        auth,
        authCheckState,
        logout
    }

}

export default useAuth