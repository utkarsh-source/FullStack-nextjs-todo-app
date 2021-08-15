import { createContext, useReducer } from "react"
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "./action/actionType"

export const Context = createContext({})

const initialState = {
    authDetails: {
        token: typeof window !== 'undefined' && sessionStorage.getItem("token"),
        userName: null,
        userProfile: null,
        isLoading: false,
        error : null,
    }
}

const reducers = (state, {type, payload}) => {
    switch (type) {
        case LOGIN_REQUEST:
            return {...state, authDetails: {isLoading: true}}
        case LOGIN_SUCCESS:
            return { ...state, authDetails: { isLoading: false, token: payload.accessToken, userName: payload.profile.name, userProfile: payload.profile.profileUrl } }
        case LOGIN_FAIL:
            return { ...state, authDetails: { isLoading: false, error: payload.error } }
        case LOGOUT:
            return { ...state, authDetails: { isLoading: false, token: null, userName: null, userProfile: null} }
        
    }
}

function AppContext({ children }) {
    
    const [state, dispatch] = useReducer(reducers, initialState)


    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    )
}

export default AppContext
