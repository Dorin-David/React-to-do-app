import { useReducer } from 'react';
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
                userId: null
            }
        default:
            return initialState
    }
}

const useAuth = () => {
    const [userAuthState, dispatch] = useReducer(authReducer, initialState)

    const authStart = () => ({
        type: "AUTH_START"
    })

    const authSuccess = (token, userId) => ({
        type: "AUTH_SUCCESS",
        token,
        userId
    })

    const authFail = error => ({
        type: "AUTH_FAIL",
        error
    })

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('userId')
        return {
            type: "AUTH_LOGOUT"
        }
    }

    //implement auto logout when token expires
    const checkAuthTimeout = expirationTime => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
    }

    const auth = (email, password, command) => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCL98oN6nr0uECgFWmhT6hYOLrAFsusX88';                                                  
        if(command === 'register'){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCL98oN6nr0uECgFWmhT6hYOLrAFsusX88'
        } 

        console.log('[authHelper] triggered with', url, authData)
        axios.post(url, authData)
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.localId)
                dispatch(authSuccess(res.data.idToken, res.data.localId))
                dispatch(checkAuthTimeout(res.data.expiresIn))
            })
            .catch(rej => {
                dispatch(authFail(rej.response.data.error))
            })
    }

    const authCheckState = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime() / 1000)))
            }
        }
    }

    return {
        userAuthState,
        auth,
        authCheckState
    }

}

export default useAuth