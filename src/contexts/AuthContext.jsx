import { createContext, useContext, useReducer } from "react"
import axios from "../api/axios"

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isRegistered: false,
  error: "",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isRegistered: true,
        error: "",
      }

    case "register": {
      return {
        ...state,
        user: action.payload,
        isAuthenticated: false,
        isRegistered: true,
        error: "",
      }
    }

    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isRegistered: true,
        error: "",
      }

    case "error":
      return {
        ...state,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      }

    case "initialRender":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isRegistered: false,
        error: "",
      }

    default:
      return state
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error, isRegistered }, dispatch] = useReducer(
    reducer,
    initialState
  )

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password })
      dispatch({ type: "login", payload: response.data })
    } catch (err) {
      console.log(err)
      dispatch({
        type: "error",
        payload: err.response.data.error,
      })
    }
  }

  const logout = () => {
    dispatch({ type: "logout" })
  }

  const registerUser = async (newUser) => {
    try {
      const response = await axios.post("/register", newUser)

      dispatch({ type: "register", payload: response.data })
    } catch (err) {
      console.log(err)
      dispatch({
        type: "error",
        payload: err.response.data.error,
      })
    }
  }

  const initialRender = () => dispatch({ type: "initialRender" })

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isRegistered,
        login,
        logout,
        dispatch,
        registerUser,
        error,
        initialRender,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined)
    throw new Error("Context was used outside the Provider")

  return context
}

export { useAuth, AuthProvider }
