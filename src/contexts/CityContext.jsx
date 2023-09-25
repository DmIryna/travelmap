import { createContext, useContext, useCallback, useReducer } from "react"
import axios from "../api/axios"

const CityContext = createContext()

const CITIES_URL = "/cities"

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

const reducer = (state, action) => {
  switch (action.type) {
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false }

    case "city/loaded":
      return { ...state, currentCity: action.payload, isLoading: false }

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      }

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      }

    case "loading":
      return { ...state, isLoading: action.payload }

    case "rejected":
      return { ...state, error: action.payload, isLoading: false }

    default:
      return state
  }
}

function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  )

  const getAllCities = useCallback(async (userId) => {
    dispatch({ type: "loading", payload: true })

    try {
      const response = await axios.get(`/${userId}${CITIES_URL}`)
      dispatch({ type: "cities/loaded", payload: response.data })
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error fetching cities",
      })
    }
  }, [])

  const getCurrentCity = useCallback(async (userId, id) => {
    if (Number(id) === currentCity.id) return

    dispatch({ type: "loading", payload: true })

    try {
      const response = await axios.get(`/${userId}${CITIES_URL}/${id}`)
      dispatch({ type: "city/loaded", payload: response.data })
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error getting the city",
      })
    }
  }, [])

  const createCity = async (userId, newCity) => {
    dispatch({ type: "loading", payload: true })

    try {
      const response = await axios.post(`/${userId}${CITIES_URL}`, newCity)

      dispatch({ type: "city/created", payload: response.data })
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      })
    }
  }

  const deleteCity = async (userId, id) => {
    dispatch({ type: "loading", payload: true })

    try {
      await axios.delete(`/${userId}${CITIES_URL}/${id}`)

      dispatch({ type: "city/deleted", payload: id })
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      })
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        getAllCities,
        getCurrentCity,
        currentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CityContext.Provider>
  )
}

const useCities = () => {
  const context = useContext(CityContext)
  if (context === undefined)
    throw new Error(`CityContext was used outside the CityProvider`)

  return context
}

export { useCities, CityProvider }
